import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Category } from 'src/categories/schemas/categories.shcema';

export type PostDocument = mongoose.HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  content: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }])
  categories: Category[];
}

export const PostShcema = SchemaFactory.createForClass(Post).pre(
  ['find', 'findOneAndUpdate', 'findOneAndDelete', 'findOne'],
  function (next) {
    this.select({ __v: false });
    next();
  },
);
