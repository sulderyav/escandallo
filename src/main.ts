import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  i18nValidationErrorFactory,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';

import { AppModule } from './app.module';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
const configService = new ConfigService();

async function bootstrap() {
  const appOptions: NestApplicationOptions & { trustProxy?: boolean } = {
    trustProxy: true,
  };

  const app = await NestFactory.create(AppModule, appOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new I18nValidationExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Escandallo API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  console.info(`Server running on PORT: ${configService.get<number>('PORT')}`);
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
