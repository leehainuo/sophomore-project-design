import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FindOnePostDto } from './dto/find-one-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Post('/delete')
  delete(@Body() deletePostDto: DeletePostDto) {
    return this.postService.delete(deletePostDto);
  }

  @Get('/findall')
  findAll() {
    return this.postService.findAll();
  }

  @Post('/findone')
  findOne(@Body() findOnePostDto: FindOnePostDto) {
    return this.postService.findOne(findOnePostDto);
  }
}
