import {
  int,
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';

// 用户表
export const user = mysqlTable('t_user', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 角色表
export const role = mysqlTable('t_role', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
});

// 用户角色关系表
export const userRoleRel = mysqlTable('t_user_role_rel', {
  userId: int('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  roleId: int('role_id')
    .notNull()
    .references(() => role.id, { onDelete: 'cascade' }),
});

// 文章表
export const post = mysqlTable('t_post', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  authorId: int('author_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }), // 主作者
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
