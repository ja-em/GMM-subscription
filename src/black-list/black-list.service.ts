import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BlackList, PrismaClient } from '@prisma/client';
import { CreateBlackListBody } from './black-list.dto';

@Injectable()
export class BlackListService {
  private _logger = new Logger(BlackListService.name);
  constructor(private _prismaClient: PrismaClient) {}

  async findInBlackList(msisdn: string): Promise<string> {
    try {
      const find = await this._prismaClient.blackList.findUnique({
        where: { msisdn },
      });
      return find?.reason;
    } catch (e) {
      this._logger.error(e);
      throw e;
    }
  }

  async createBlackList(body: CreateBlackListBody) {
    try {
      const reason = await this.findInBlackList(body.msisdn);
      if (!!reason) {
        throw new BadRequestException(
          `this MSISDN is in black-list because ${reason}`,
        );
      }
      const data = await this._prismaClient.blackList.create({ data: body });
      return data;
    } catch (e) {
      throw e;
    }
  }

  private async _findByMsisdn(msisdn: string): Promise<BlackList> {
    const find = await this._prismaClient.blackList.findUnique({
      where: { msisdn },
    });
    if (!find) {
      throw new NotFoundException(
        `this MSISDN [${msisdn}] has not been found.`,
      );
    }
    return find;
  }

  async deleteBlackListByMsisdn(msisdn: string) {
    try {
      const find = await this._findByMsisdn(msisdn);
      await this._prismaClient.blackList.delete({ where: { id: find.id } });
      return `this MSISDN [${msisdn}] has been deleted`;
    } catch (e) {
      throw e;
    }
  }

  async updateBlackListByMsisdn(msisdn: string, reason: string) {
    try {
      const find = await this._findByMsisdn(msisdn);
      const newData = await this._prismaClient.blackList.update({
        where: { id: find.id },
        data: { reason },
      });
      return newData;
    } catch (e) {
      throw e;
    }
  }
}
