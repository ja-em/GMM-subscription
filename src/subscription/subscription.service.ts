import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DeleteByMsisdnAndServiceId, RegisterBody } from './subscription.dto';
import * as dayjs from 'dayjs';
import { ServiceService } from 'src/service/service.service';
import { BlackListService } from 'src/black-list/black-list.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private _prismaClient: PrismaClient,
    private _serviceService: ServiceService,
    private _blackListService: BlackListService,
  ) {}

  async register(body: RegisterBody) {
    try {
      await this._validateBeforeRegister(body);
      await this._prismaClient.subscription.create({
        data: {
          msisdn: body.msisdn,
          serviceId: body.serviceId,
        },
      });
      return 'OK';
    } catch (e) {
      throw e;
    }
  }

  private async _validateBeforeRegister(body: RegisterBody): Promise<boolean> {
    const [sub, isValidService, blackListReason] = await Promise.all([
      this._prismaClient.subscription.findMany({
        where: { msisdn: body.msisdn },
        orderBy: {
          registerAt: 'desc',
        },
      }),
      this._serviceService.validateService(body.serviceId),
      this._blackListService.isInBlackList(body.msisdn),
    ]);

    //* The msisdn must not be listed in the blacklist table, meaning it is not banned from registering.
    if (!!blackListReason) {
      throw new ForbiddenException(
        `You are blacklisted because ${blackListReason}`,
      );
    }

    if (!isValidService) {
      throw new NotFoundException('this service has not been found');
    }

    if (sub.length === 0) return true;

    //* A single msisdn can register for more than one service but not more than three services.
    if (sub.length >= 3) {
      throw new BadRequestException(
        'Your subscription has exceeded the limit.',
      );
    }

    const isHasService =
      sub.findIndex((e) => e.serviceId === body.serviceId) !== -1;
    if (isHasService) {
      throw new ConflictException(`you have registered this service`);
    }
    //* The same msisdn can register again, but only after 30 days from their last registration.
    console.log(dayjs().diff(dayjs(sub[0].registerAt), 'days'));
    if (dayjs().diff(dayjs(sub[0].registerAt), 'days') > 30) {
      throw new BadRequestException(
        "You can't register anymore because your last subscription is greater than 30 days",
      );
    }

    return true;
  }

  async getByMsisdn(msisdn: string) {
    try {
      const find = await this._prismaClient.subscription.findMany({
        where: { msisdn },
        include: {
          seviceDetail: true,
        },
      });
      return find;
    } catch (e) {
      throw e;
    }
  }

  async deleteByMsisdnAndServiceId(param: DeleteByMsisdnAndServiceId) {
    try {
      const find = await this._prismaClient.subscription.findFirst({
        where: param,
      });
      if (!find) {
        throw new NotFoundException(
          `this MSISDN (${param.msisdn}) and serviceId (${param.serviceId}) can't be found`,
        );
      }

      await this._prismaClient.subscription.delete({ where: { id: find.id } });

      return `this MSISDN (${param.msisdn}) and serviceId (${param.serviceId}) were deleted`;
    } catch (e) {
      throw e;
    }
  }
}
