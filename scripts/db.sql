-- 如果数据库存在，先删除（⚠️ 危险操作！会清空数据）
DROP DATABASE IF EXISTS `demo`;
-- 创建新数据库（指定字符集和排序规则）
CREATE DATABASE `demo` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 选择数据库
USE `demo`;

