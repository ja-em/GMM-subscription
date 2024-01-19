import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalInterceptor } from './utils/interceptor';

(async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new GlobalInterceptor());
    await app.listen(3000);
  } catch (e) {
    Logger.error(e, 'MAIN');
  }
})();
