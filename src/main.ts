import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from '@modules/common/adapters/redis-io.adapter';
import { ConfigService } from '@nestjs/config';
import { WebsocketConfig } from '@config/types';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService<unknown, true>);

  const redisAdapter = new RedisIoAdapter(app);
  await redisAdapter.connectToRedis(
    configService.get<WebsocketConfig>('websocketConfig'),
  );
  app.useWebSocketAdapter(redisAdapter);

  if (configService.get<string>('app_env') !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth(
        {
          // I was also testing it without prefix 'Bearer ' before the JWT
          description: `Please enter token in following format: Bearer <JWT>`,
          name: 'Authorization',
          bearerFormat: 'Bearer',
          scheme: 'Bearer',
          type: 'http',
          in: 'Header',
        },
        'access-token',
      )
      .setTitle('Bumper Cars Core Service')
      .setDescription('The Bumper Cars Core Service API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
