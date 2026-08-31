import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class StartupsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return { message: 'Startups module — implementation coming next' };
  }
}
