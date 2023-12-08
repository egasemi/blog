import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/posts.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto) {
    const createdPost = new this.postModel(createPostDto);
    await createdPost.save();
    const newPost = await createdPost.populate('categories', 'name');
    return newPost.toObject();
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.postModel
      .find()
      .populate('categories', 'name')
      .select('-__v');
    if (!posts) throw new NotFoundException();
    return posts;
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('categories', 'name');
    if (!post) throw new NotFoundException();
    return post.toObject();
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .populate('categories', 'name');

    return updatedPost.toObject();
  }

  async remove(id: string): Promise<Post> {
    const deletedPost = await this.postModel
      .findByIdAndDelete(id)
      .populate('categories', 'name');
    return deletedPost.toObject();
  }
}
