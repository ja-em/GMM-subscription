import { Global, Module, OnModuleDestroy } from '@nestjs/common';
import { SubscriptionModule } from './subscription/subscription.module';
import { PrismaClient } from '@prisma/client';
import { ServiceModule } from './service/service.module';
import { BlackListModule } from './black-list/black-list.module';
@Global()
@Module({
  imports: [SubscriptionModule, ServiceModule, BlackListModule],
  providers: [PrismaClient],
  exports: [PrismaClient],
})
export class AppModule implements OnModuleDestroy {
  constructor(private _prismaClient: PrismaClient) {}
  async onModuleDestroy() {
    await this._prismaClient.$disconnect();
  }
}
