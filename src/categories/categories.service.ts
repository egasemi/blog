import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/categories.shcema';
import { Model } from 'mongoose';
import { Post } from 'src/posts/schemas/posts.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const createdCategory = new this.categoryModel(createCategoryDto);
      await createdCategory.save();
      return createdCategory.toObject();
    } catch (e) {
      console.error(e);
    }
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().select('name').exec();
    if (!categories) throw new NotFoundException();
    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) throw new NotFoundException();
    return category.toObject();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    return updatedCategory.toObject();
  }

  async remove(id: string): Promise<Category> {
    const updatePost = await this.postModel.updateMany(
      { categories: id },
      { $pull: { categories: id } },
    );

    if (!updatePost.acknowledged) {
      throw new InternalServerErrorException('no se pudo actualizar los posts');
    }
    const deletedCategory = await this.categoryModel
      .findByIdAndRemove(id)
      .exec();
    return deletedCategory.toObject();
  }
}
