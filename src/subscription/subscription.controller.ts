import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { RegisterBody } from './subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly _subscriptionService: SubscriptionService) {}
  @Post()
  register(@Body() body: RegisterBody) {
    return this._subscriptionService.register(body);
  }
}
