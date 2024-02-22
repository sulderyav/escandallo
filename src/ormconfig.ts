// import { ConfigService } from '@nestjs/config';
// import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// const configService = new ConfigService();

// const config = [
//   {
//     type: 'postgres',
//     host: configService.get<string>('DB_HOST'),
//     port: configService.get<number>('DB_PORT'),
//     username: configService.get<string>('DB_USERNAME'),
//     password: configService.get<string>('DB_PASSWORD'),
//     database: configService.get<string>('DB_DATABASE'),
//     synchronize: false,
//     // migrations: ['src/migrations/*.ts'],
//     migrations: ['src/database/seeds/*.ts'],
//     migrationsTableName: 'migrations',
//     entities: ['src/**/*.entity.ts'],
//     seeds: [`src/seeds/*.seed{.ts,.js}`],
//     cli: {
//       entitiesDir: 'src/modules',
//       migrationsDir: 'src/migrations',
//     },
//     ssl: {
//       rejectUnauthorized: false,
//       requestCert: configService.get<string>('NODE_ENV') === 'production',
//       ca:
//         configService.get<string>('NODE_ENV') === 'production'
//           ? './ca-certificate.crt'
//           : undefined,
//     },
//     timezone: '-05:00',
//     namingStrategy: new SnakeNamingStrategy(),
//   },
// ];

// export = config;

import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

require('dotenv').config();

const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  // migrations: ['src/database/migrations/*.ts'],
  migrations: ['src/database/seeds/*.ts'],
  migrationsTableName: 'migrations',
  entities: ['src/**/*.entity.ts'],
  namingStrategy: new SnakeNamingStrategy(),
});

export default connectionSource;
