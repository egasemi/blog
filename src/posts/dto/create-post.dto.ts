import { CategoryDocument } from 'src/categories/schemas/categories.shcema';

export class CreatePostDto {
  title: string;
  author: string;
  content: string;
  categories: CategoryDocument['_id'][];
}
