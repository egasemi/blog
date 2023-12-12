import { UserDocument } from 'src/users/schemas/user.schema';

export class CreatePostDto {
  title: string;
  content: string;
  author: UserDocument['_id'];
  categories?: string[];
}
