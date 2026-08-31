import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class PilotsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return { message: 'Pilots module — implementation coming next' };
  }
}
