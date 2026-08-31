import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export interface EmailPayload {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.from = config.get<string>('SMTP_FROM', 'GovSetu <noreply@govsetu.gov.in>');

    this.transporter = nodemailer.createTransport({
      host: config.get<string>('SMTP_HOST', 'localhost'),
      port: config.get<number>('SMTP_PORT', 1025),
      secure: config.get<string>('SMTP_SECURE', 'false') === 'true',
      auth:
        config.get<string>('SMTP_USER')
          ? {
              user: config.get<string>('SMTP_USER'),
              pass: config.get<string>('SMTP_PASS'),
            }
          : undefined,
    });
  }

  async sendEmail(payload: EmailPayload): Promise<void> {
    try {
      const mailOptions: Mail.Options = {
        from: this.from,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId} → ${payload.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${payload.to}: ${(error as Error).message}`);
      // Don't throw — email failures should not break the main request flow
    }
  }

  async sendWelcomeEmail(email: string, name: string, verifyToken: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Welcome to GovSetu — Verify your email',
      html: `
        <h2>Welcome to GovSetu, ${name}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <p>
          <a href="${this.getAppBaseUrl()}/auth/verify-email?token=${verifyToken}"
             style="background:#4f46e5;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">
            Verify Email
          </a>
        </p>
        <p>This link expires in 24 hours.</p>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'GovSetu — Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset for your GovSetu account.</p>
        <p>
          <a href="${this.getAppBaseUrl()}/auth/reset-password?token=${resetToken}"
             style="background:#4f46e5;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">
            Reset Password
          </a>
        </p>
        <p>This link expires in 1 hour. If you did not request this, please ignore this email.</p>
      `,
    });
  }

  async sendApplicationStatusEmail(
    email: string,
    name: string,
    challengeTitle: string,
    newStatus: string,
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: `GovSetu — Application Update: ${challengeTitle}`,
      html: `
        <h2>Application Status Update</h2>
        <p>Dear ${name},</p>
        <p>Your application for <strong>${challengeTitle}</strong> has been updated.</p>
        <p>New Status: <strong>${newStatus}</strong></p>
        <p><a href="${this.getAppBaseUrl()}/applications">View your applications</a></p>
      `,
    });
  }

  private getAppBaseUrl(): string {
    return this.config.get<string>('APP_BASE_URL', 'http://localhost:3001');
  }
}
