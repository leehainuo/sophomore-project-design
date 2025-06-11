import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';
import * as schema from './schema/schema';
import { DrizzleService } from './drizzle.service';

@Module({
  providers: [
    {
      provide: 'Drizzle_ORM',
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL');

        if (!connectionString) {
          throw new Error(
            'MySQL 连接字符串 (DATABASE_URL) 没有在环境变量中设置',
          );
        }

        const pool = createPool(connectionString);

        return drizzle(pool, {
          schema: schema,
          mode: 'default',
        });
      },
      inject: [ConfigService],
    },
    DrizzleService,
  ],
  exports: ['Drizzle_ORM', DrizzleService],
})
export class DrizzleModule {}
