import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Request() { user }) {
    return this.postsService.create(createPostDto, user._id);
  }

  @Get()
  findAll(@Query() query: { page: number; limit: number }) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, IsCreatorGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, IsCreatorGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Get('search')
  findBy(@Query() query: { search: string; limit: number; page: number }) {
    return this.postsService.search(query);
  }
  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.postsService.findByUser(id);
  }
  @Get('categories')
  findCategories() {
    return this.postsService.findCategories();
  }
}
