import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {} from 'ioredis';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function configureMicroservices() {
  const redisTransport =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    });
  redisTransport.listen();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('FakeBook')
    .setDescription('The FakeBook API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors({
    origin: process.env.ALLOW_ORIGIN,
  });

  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}
bootstrap();
