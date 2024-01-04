import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { I18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import * as path from 'path';
import { RequestContextModule } from 'nestjs-request-context';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { StoreModule } from './modules/store/store.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ClientsModule } from './modules/clients/clients.module';
import { EmailsModule } from './modules/emails/emails.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CataloguesModule } from './modules/catalogues/catalogues.module';
import { CataloguesItemsModule } from './modules/catalogues/catalogues-items/catalogues-items.module';
import { DatafastModule } from './modules/datafast/datafast.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
        PORT: Joi.number().required(),
        SEND_EMAILS: Joi.boolean().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.number().required(),
        JWT_REFRESH_EXPIRATION: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string().empty(''),
        DB_DATABASE: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.number().required(),
        EMAIL_USERNAME: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        EMAIL_FROM: Joi.string().required(),
        ADMIN_STORE_URL: Joi.string().required(),
        STORE_URL: Joi.string().required(),
        STORE_OWNER_EMAIL: Joi.string().required(),
        DATAFAST_URL: Joi.string().required(),
        DATAFAST_ENTITY_ID: Joi.string().required(),
        DATAFAST_TERMINAL_ID: Joi.string().required(),
        DATAFAST_SECURITY_ID: Joi.string().required(),
        DATAFAST_SUPPLIER_ID: Joi.string().required(),
        DATAFAST_MERCHANT_ID: Joi.string().required(),
        DATAFAST_TOKEN: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize: true,
        logging: false,
        logger: 'advanced-console',
        timezone: '-05:00',
        keepConnectionAlive: configService.get<string>('NODE_ENV') === 'test',
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
        ssl: {
          rejectUnauthorized: false,
          requestCert: configService.get<string>('NODE_ENV') === 'production',
          ca:
            configService.get<string>('NODE_ENV') === 'production'
              ? './ca-certificate.crt'
              : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: {
        path: path.join(__dirname, '/i18n'),
      },
      resolvers: [AcceptLanguageResolver],
    }),
    RequestContextModule,
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    ProductsModule,
    SalesModule,
    StoreModule,
    UploadsModule,
    ClientsModule,
    EmailsModule,
    TasksModule,
    CataloguesModule,
    CataloguesItemsModule,
    DatafastModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
