import { Injectable, Inject } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from './schema/schema';

export type DrizzleSchema = typeof schema;
export type DB = MySql2Database<DrizzleSchema>;

@Injectable()
export class DrizzleService {
  constructor(@Inject('Drizzle_ORM') private db: DB) {}

  get dbInstance(): DB {
    return this.db;
  }

  get schema(): DrizzleSchema {
    return schema;
  }
}
