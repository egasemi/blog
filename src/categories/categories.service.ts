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
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private postsService: PostsService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const createdCategory = new this.categoryModel(createCategoryDto);
      return await createdCategory.save();
    } catch (e) {
      console.error(e);
    }
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().lean();
    if (!categories) throw new NotFoundException();
    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).lean();
    if (!category) throw new NotFoundException();
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .lean();
    return updatedCategory;
  }

  async remove(id: string): Promise<Category> {
    const updatedPosts = await this.postsService.cascadeCategoryDelete(id);
    if (!updatedPosts) {
      throw new InternalServerErrorException('no se pudieron editar los posts');
    }
    const deletedCategory = await this.categoryModel
      .findByIdAndDelete(id)
      .lean();
    return deletedCategory;
  }
}
