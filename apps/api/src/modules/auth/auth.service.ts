import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { UserRole } from '../../common/enums/user-role.enum';
import { AuditAction } from '../../common/enums/platform.enum';

const SALT_ROUNDS = 12;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    organizationId: string | null;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── Registration ──────────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<AuthTokens> {
    // Check for duplicate email
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const emailVerifyToken = uuidv4();

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role ?? UserRole.STARTUP_USER,
        organizationId: dto.organizationId ?? null,
        emailVerifyToken,
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: AuditAction.USER_REGISTERED,
        entityType: 'User',
        entityId: user.id,
        newValue: { email: user.email, role: user.role },
      },
    });

    this.logger.log(`New user registered: ${user.email} [${user.role}]`);

    const tokens = await this.generateTokens(user.id, user.email, user.role as UserRole, user.organizationId);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as UserRole,
        organizationId: user.organizationId,
      },
    };
  }

  // ─── Login ─────────────────────────────────────────────────────────────────

  async login(dto: LoginDto, ipAddress?: string): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: AuditAction.USER_LOGIN,
        entityType: 'User',
        entityId: user.id,
        ipAddress: ipAddress,
      },
    });

    this.logger.log(`User logged in: ${user.email}`);

    const tokens = await this.generateTokens(user.id, user.email, user.role as UserRole, user.organizationId);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as UserRole,
        organizationId: user.organizationId,
      },
    };
  }

  // ─── Refresh Token ─────────────────────────────────────────────────────────

  async refreshTokens(dto: RefreshTokenDto): Promise<AuthTokens> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(dto.refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, organizationId: true, isActive: true, refreshToken: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account not found or inactive');
    }

    // Validate that the stored hashed refresh token matches
    if (!user.refreshToken) {
      throw new UnauthorizedException('Session expired — please login again');
    }

    const isTokenValid = await bcrypt.compare(dto.refreshToken, user.refreshToken);
    if (!isTokenValid) {
      throw new UnauthorizedException('Refresh token rotation: token mismatch');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role as UserRole, user.organizationId);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: '',
        lastName: '',
        role: user.role as UserRole,
        organizationId: user.organizationId,
      },
    };
  }

  // ─── Logout ────────────────────────────────────────────────────────────────

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // ─── Email Verification ─────────────────────────────────────────────────────

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired email verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, emailVerifyToken: null },
    });

    return { message: 'Email verified successfully' };
  }

  // ─── Forgot Password ───────────────────────────────────────────────────────

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // Return same message regardless to prevent email enumeration
    if (!user) {
      return { message: 'If this email exists, a reset link will be sent' };
    }

    const resetToken = uuidv4();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: resetToken, passwordResetExpiry: resetExpiry },
    });

    // TODO: Send email via EmailService (Task 14)
    this.logger.log(`Password reset requested for: ${user.email}, token: ${resetToken}`);

    return { message: 'If this email exists, a reset link will be sent' };
  }

  // ─── Reset Password ─────────────────────────────────────────────────────────

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: dto.token,
        passwordResetExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpiry: null,
        refreshToken: null, // Invalidate all sessions
      },
    });

    return { message: 'Password reset successfully' };
  }

  // ─── Change Password ────────────────────────────────────────────────────────

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, refreshToken: null },
    });

    return { message: 'Password changed successfully' };
  }

  // ─── Internal Helpers ───────────────────────────────────────────────────────

  private async generateTokens(
    userId: string,
    email: string,
    role: UserRole,
    organizationId: string | null,
  ): Promise<Pick<AuthTokens, 'accessToken' | 'refreshToken' | 'expiresIn'>> {
    const payload: JwtPayload = { sub: userId, email, role, organizationId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
    };
  }

  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashed = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }
}
