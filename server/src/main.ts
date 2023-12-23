import { CONFIG_VALUES } from '@config/configuration';
import { AUTH_COOKIES, AUTH_TOKENS } from '@features/auth/auth.constants';
// import { RedisIoAdapter } from '@libs/adapters/reids-io.adapter';
import { MongooseExceptionFilter } from '@libs/filters/mongoose-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Setting up the app
  const allowedOrigins = configService
    .getOrThrow<string>(CONFIG_VALUES.CORS.ALLOWED_ORIGINS)
    .split(',');

  app.enableCors({
    credentials: true,
    origin: allowedOrigins,
  });

  const apiPrefix = configService.getOrThrow<string>(
    CONFIG_VALUES.APP.API_PREFIX,
  );

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.use(helmet());
  app.use(cookieParser());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Setting up the socket server
  // const redisIoAdapter = new RedisIoAdapter(app, configService);
  // await redisIoAdapter.connectToRedis();

  // app.useWebSocketAdapter(redisIoAdapter);

  // Setting up swagger docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('RESTful API')
    .setDescription("Chatto's RESTful API")
    .setVersion('1.0')
    .addCookieAuth(
      AUTH_COOKIES.REFRESH_TOKEN,
      {
        in: 'cookie',
        name: AUTH_COOKIES.REFRESH_TOKEN,
        type: 'apiKey',
      },
      AUTH_COOKIES.REFRESH_TOKEN,
    )
    .addBearerAuth(
      {
        in: 'header',
        name: AUTH_TOKENS.accessToken,
        scheme: 'bearer',
        type: 'http',
      },
      AUTH_TOKENS.accessToken,
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, swaggerDocument);

  // Init app
  await app.listen(3000);
}
bootstrap();
