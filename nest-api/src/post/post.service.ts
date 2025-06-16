import { Injectable } from '@nestjs/common';
import { DB, DrizzleService } from 'src/drizzle/drizzle.service';
import { CreatePostDto } from './dto/create-post.dto';
import { post } from 'src/drizzle/schema/schema';
import { FindOnePostDto } from './dto/find-one-post.dto';
import { eq, or, like } from 'drizzle-orm';
import { DeletePostDto } from './dto/delete-post.dto';

@Injectable()
export class PostService {
  private readonly db: DB;

  constructor(private readonly drizzleService: DrizzleService) {
    this.db = this.drizzleService.dbInstance;
  }

  async create(createPostDto: CreatePostDto) {
    // 解构 dto
    const { title, content, authorId } = createPostDto;
    // 存入数据库
    try {
      const res = await this.db.insert(post).values({
        title: title,
        content: content,
        authorId: authorId,
      });
      console.log(res);
      return '创建帖子成功';
    } catch (e) {
      console.log('创建帖子失败:', e);
      throw new Error('无法创建帖子');
    }
  }

  async delete(deletePostDto: DeletePostDto) {
    // 解构 dto
    const { postId } = deletePostDto;
    try {
      const res = await this.db.delete(post).where(eq(post.id, postId));
      console.log(res);
      return '删除帖子成功';
    } catch (e) {
      console.log('删除帖子失败', e);
      throw new Error('无法删除帖子');
    }
  }

  async findAll(search: string) {
    try {
      console.log('🌈 Service层接受参数:', search);
      if (search === undefined) {
        const res = await this.db.select().from(post);
        return res;
      } else {
        const res = await this.db
          .select()
          .from(post)
          .where(or(like(post.title, `%${search}%`)));
        return res;
      }
    } catch (e) {
      console.log('查询所有帖子失败:', e);
      throw new Error('无法查询所有帖子');
    }
  }

  async findOne(findOnePostDto: FindOnePostDto) {
    // 解构 dto
    const { postId } = findOnePostDto;
    try {
      const res = await this.db.select().from(post).where(eq(post.id, postId));
      return res;
    } catch (e) {
      console.log('查询帖子失败:', e);
      throw new Error('无法查询帖子');
    }
  }
}
