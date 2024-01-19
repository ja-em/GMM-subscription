import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { ServiceModule } from 'src/service/service.module';
import { BlackListModule } from 'src/black-list/black-list.module';

@Module({
  imports: [ServiceModule, BlackListModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
