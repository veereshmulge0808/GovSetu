import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { NotificationType } from '../../common/enums/platform.enum';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create an in-app notification for a user.
   */
  async createNotification(payload: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    actionUrl?: string;
    referenceId?: string;
    referenceType?: string;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        actionUrl: payload.actionUrl,
        referenceId: payload.referenceId,
        referenceType: payload.referenceType,
      },
    });

    this.logger.debug(`Notification created for user ${payload.userId}: ${payload.title}`);
    return notification;
  }

  /**
   * Get notifications for the current user.
   */
  async getMyNotifications(userId: string, onlyUnread = false, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { userId };
    if (onlyUnread) where.status = 'UNREAD';

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, status: 'UNREAD' } }),
    ]);

    return {
      data: notifications,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), unreadCount },
    };
  }

  /**
   * Mark a notification as read.
   */
  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { status: 'READ', readAt: new Date() },
    });
  }

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, status: 'UNREAD' },
      data: { status: 'READ', readAt: new Date() },
    });
  }

  async findAll() {
    return { message: 'Use /notifications/me to get your notifications' };
  }
}
