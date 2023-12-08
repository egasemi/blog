import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ toObject: { versionKey: false } })
export class Category {
  @Prop({ required: true })
  name: string;
}

export type CategoryDocument = mongoose.HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);
