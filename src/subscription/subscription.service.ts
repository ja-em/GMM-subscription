import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RegisterBody } from './subscription.dto';
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
    const [sub, isValidService, isInBlackList] = await Promise.all([
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
    if (isInBlackList) {
      throw new ForbiddenException('You are blacklisted.');
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
    // console.log(dayjs().diff(dayjs(sub[0].registerAt), 'days'));
    if (dayjs().diff(dayjs(sub[0].registerAt), 'days') > 30) {
      throw new BadRequestException(
        "You can't register anymore because your last subscription is greater than 30 days",
      );
    }

    return true;
  }
}
