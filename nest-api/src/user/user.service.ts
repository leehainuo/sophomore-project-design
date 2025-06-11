import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DB, DrizzleService } from 'src/drizzle/drizzle.service';
import { eq } from 'drizzle-orm';
import { user, role, userRoleRel } from 'src/drizzle/schema/schema';
import * as bcrypt from 'bcryptjs';
import { FindOneUserDto } from './dto/find-one-user.dto';

@Injectable()
export class UserService {
  private readonly db: DB;
  private readonly SALT_ROUNDS = 10; // 密码哈希的盐值轮数

  constructor(private readonly drizzleService: DrizzleService) {
    this.db = this.drizzleService.dbInstance;
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    // 检查用户名是否已经存在
    const existedUser = await this.db
      .select()
      .from(user)
      .where(eq(user.name, username));
    if (existedUser.length > 0) {
      throw new ConflictException('用户名已存在');
    }

    const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

    try {
      const res = await this.db.insert(user).values({
        name: username,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      // Drizzle ORM 的 insert 返回可能因数据库驱动而异，这里假设它返回插入的ID或相关信息
      // 对于 MySQL2，insert 返回一个对象，包含 affectedRows 和 insertId
      return { id: res[0].insertId, username }; // 返回部分用户信息
    } catch (e) {
      console.error('创建用户失败:', e);
      throw new Error('无法创建用户');
    }
  }

  async findOne(findOneUserDto: FindOneUserDto) {
    const { username, password } = findOneUserDto;
    console.log('!!!!!', username, password);
    // 1. 查找用户
    const foundUsers = await this.db
      .select()
      .from(user)
      .where(eq(user.name, username));
    const foundUser = foundUsers[0];

    if (!foundUser) {
      throw new UnauthorizedException('用户名或密码不正确');
    }

    // 2. 验证密码
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码不正确');
    }

    // 3. 查找用户角色
    const userWithRole = await this.db
      .select({
        id: user.id,
        username: user.name,
        role: role.name,
      })
      .from(user)
      .leftJoin(userRoleRel, eq(user.id, userRoleRel.userId))
      .leftJoin(role, eq(userRoleRel.roleId, role.id))
      .where(eq(user.id, foundUser.id));

    if (userWithRole.length === 0 || !userWithRole[0].role) {
      throw new UnauthorizedException('用户角色信息缺失');
    }

    return {
      id: userWithRole[0].id,
      username: userWithRole[0].username,
      role: userWithRole[0].role,
    };
  }
}
