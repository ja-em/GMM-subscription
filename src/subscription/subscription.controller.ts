import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import {
  DeleteByMsisdnAndServiceId,
  GetByMsisdnParam,
  RegisterBody,
} from './subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly _subscriptionService: SubscriptionService) {}
  @Post()
  register(@Body() body: RegisterBody) {
    return this._subscriptionService.register(body);
  }

  @Get('msisdn/:msisdn')
  getByMsisdn(@Param() param: GetByMsisdnParam) {
    return this._subscriptionService.getByMsisdn(param.msisdn);
  }

  @Delete('msisdn/:msisdn/service-id/:serviceId')
  deleteByMsisdnAndServiceId(@Param() param: DeleteByMsisdnAndServiceId) {
    return this._subscriptionService.deleteByMsisdnAndServiceId(param);
  }
}
