import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/posts.schema';
import { Model } from 'mongoose';
import { QueryPostDto } from './dto/query-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto, user_id: string) {
    createPostDto = this.normalizeCategory(createPostDto);
    const createdPost = new this.postModel({
      ...createPostDto,
      author: user_id,
    });
    const savedPost = await createdPost.save();
    await savedPost.populate('author', 'username');
    return savedPost.toObject();
  }

  async findAll(query: QueryPostDto): Promise<Post[]> {
    const posts = await this.postModel.find().setOptions(this.paginate(query));
    if (!posts) throw new NotFoundException();
    return posts;
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException();
    return post.toObject();
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    updatePostDto = this.normalizeCategory(updatePostDto);
    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      updatePostDto,
      { new: true },
    );

    return updatedPost;
  }
  async remove(id: string): Promise<Post> {
    const deletedPost = await this.postModel.findByIdAndDelete(id, {
      returnDocument: 'before',
    });
    return deletedPost;
  }

  async findByUser(id: string): Promise<Post[]> {
    const posts = await this.postModel.find({ author: id });
    return posts;
  }

  async search(query: QueryPostDto): Promise<Post[]> {
    const db_query: object = { $regex: query.search, $options: 'i' };
    const posts = await this.postModel
      .find({
        $or: [{ title: db_query }, { content: db_query }],
      })
      .setOptions(this.paginate(query));

    return posts;
  }

  async findByCategory(query: QueryPostDto): Promise<Post[]> {
    const posts = await this.postModel
      .find({ categories: query.search })
      .setOptions(this.paginate(query));
    return posts;
  }

  async findCategories(): Promise<string[]> {
    const categories = await this.postModel.distinct('categories');
    return categories;
  }

  private normalizeCategory(doc) {
    if (doc.categories) {
      return {
        ...doc,
        categories: doc.categories.map((category: string) =>
          category.toLowerCase(),
        ),
      };
    } else {
      return doc;
    }
  }

  private paginate(query: QueryPostDto) {
    const limit = query.limit || 10;
    const page = query.page || 1;
    return {
      limit,
      skip: (page - 1) * limit,
    };
  }
}
