/* eslint-disable @typescript-eslint/no-floating-promises */
import { drizzle } from 'drizzle-orm/mysql2';
import { createConnection } from 'mysql2/promise';
import { role, user, userRoleRel } from '../schema/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function main() {
  const connection = await createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  const db = drizzle(connection, {
    schema: { user, role, userRoleRel },
    mode: 'default',
  });

  try {
    console.log('🌱 正在播种数据库...');

    const usersToSeed = [
      {
        name: 'admin',
        password:
          '$2a$10$vo3Hfr8M54huwf34AZHTV.ccPs8lBqtvInJ3iUeN/seSsuLtENWM.',
        roleName: '管理员',
      },
      {
        name: 'test',
        password:
          '$2a$10$mC2oZoLzapFiVSdDa59cP.yIjhNjIGScVSRVldA5C2DFa8jntANk.',
        roleName: '普通用户',
      },
    ];

    for (const userData of usersToSeed) {
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.name, userData.name));

      if (existingUser.length === 0) {
        const newUserResult = await db.insert(user).values({
          name: userData.name,
          password: userData.password,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const newUserId = newUserResult[0].insertId; // 假设返回 [ResultSetHeader] 结构
        console.log(`用户 ${userData.name} 已插入，ID: ${newUserId}`);

        let roleId: number | undefined;
        const existingRole = await db
          .select()
          .from(role)
          .where(eq(role.name, userData.roleName));

        if (existingRole.length > 0) {
          roleId = existingRole[0].id;
          console.log(`角色 '${userData.roleName}' 已存在，ID: ${roleId}`);
        } else {
          const newRoleResult = await db.insert(role).values({
            name: userData.roleName,
          });
          roleId = newRoleResult[0].insertId; // 假设返回 [ResultSetHeader] 结构
          console.log(`角色 '${userData.roleName}' 已插入，ID: ${roleId}`);
        }

        if (newUserId && roleId) {
          const existingUserRoleRel = await db
            .select()
            .from(userRoleRel)
            .where(
              eq(userRoleRel.userId, newUserId) &&
                eq(userRoleRel.roleId, roleId),
            );

          if (existingUserRoleRel.length === 0) {
            await db.insert(userRoleRel).values({
              userId: newUserId,
              roleId: roleId,
            });
            console.log(
              `用户-角色关系已创建：${userData.name} - ${userData.roleName}`,
            );
          } else {
            console.log(
              `用户-角色关系已存在：${userData.name} - ${userData.roleName}`,
            );
          }
        }
      } else {
        console.log(`用户 ${userData.name} 已存在。跳过插入。`);
      }
    }

    console.log('✅ 播种完成！');
  } catch (error) {
    console.error('❌ 播种失败:', error);
    process.exit(1);
  } finally {
    await connection.end(); // 确保连接关闭
  }
}

main();
