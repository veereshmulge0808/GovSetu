import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class EvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return { message: 'Evaluations module — implementation coming next' };
  }
}
