import { Module, OnModuleDestroy } from '@nestjs/common';
import { SubscriptionModule } from './subscription/subscription.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [SubscriptionModule],
  providers: [PrismaClient],
})
export class AppModule implements OnModuleDestroy {
  constructor(private _prismaClient: PrismaClient) {}
  async onModuleDestroy() {
    console.log('DES');

    await this._prismaClient.$disconnect();
  }
}
