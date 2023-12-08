import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Post } from 'src/posts/schemas/posts.schema';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }])
  posts: Post[];
}
