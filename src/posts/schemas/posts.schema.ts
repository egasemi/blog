import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

export type PostDocument = mongoose.HydratedDocument<Post>;

@Schema({ toObject: { versionKey: false } })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: ObjectId, ref: 'User' })
  author: string;

  @Prop({ required: true })
  content: string;

  @Prop({ index: true })
  categories: string[];
}

export const PostShcema = SchemaFactory.createForClass(Post).pre(
  ['find', 'findOneAndUpdate', 'findOneAndDelete', 'findOne'],
  function (next) {
    this.select({ __v: false });
    this.populate('author', 'username');
    next();
  },
);
