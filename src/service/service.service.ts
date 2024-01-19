import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ServiceService {
  private _logger = new Logger(ServiceService.name);
  constructor(private _prismaClient: PrismaClient) {}
  async validateService(serviceId: string): Promise<boolean> {
    try {
      const ser = await this._prismaClient.service.findUnique({
        where: { id: serviceId },
      });

      return !!ser;
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }
}
