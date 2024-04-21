import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ACCESS_TOKEN_COOKIE,
  PORT_CONFIG_KEY,
  REFRESH_TOKEN_COOKIE,
} from './utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Vinyl Store')
    .addCookieAuth(ACCESS_TOKEN_COOKIE, { type: 'apiKey' }, ACCESS_TOKEN_COOKIE)
    .addCookieAuth(
      REFRESH_TOKEN_COOKIE,
      { type: 'apiKey' },
      REFRESH_TOKEN_COOKIE,
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>(PORT_CONFIG_KEY);
  await app.listen(PORT);
}
bootstrap();
