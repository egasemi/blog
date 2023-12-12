import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true, required: true, minlength: 3, maxlength: 10 })
  username: string;

  @Prop({
    unique: true,
    required: true,
    validate: {
      validator: function (v: string) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User).pre(
  ['find', 'findOneAndUpdate', 'findOneAndDelete', 'findOne'],
  function (next) {
    this.select({ __v: false });
    next();
  },
);
