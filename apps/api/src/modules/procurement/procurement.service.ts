import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class ProcurementService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return { message: 'Procurement module — implementation coming next' };
  }
}
