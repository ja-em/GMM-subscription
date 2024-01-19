import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BlackListService {
  private _logger = new Logger(BlackListService.name);
  constructor(private _prismaClient: PrismaClient) {}

  async isInBlackList(msisdn: string): Promise<boolean> {
    try {
      const find = await this._prismaClient.blackList.findUnique({
        where: { msisdn },
      });
      return !!find;
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }
}