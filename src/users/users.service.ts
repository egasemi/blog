import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Error } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);

    try {
      return await newUser.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      } else if (error.code === 11000) {
        throw new BadRequestException(
          `el email ${error.keyValue.email} ya está en uso`,
        );
      }
    }
  }

  async findAll() {
    const users = await this.userModel.find().lean();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).lean();
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true, runValidators: true },
      );
      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      } else if (error.code === 11000) {
        throw new BadRequestException(
          `el email ${error.keyValue.email} ya está en uso`,
        );
      }
    }
  }

  async remove(id: string) {
    const removedUser = await this.userModel.findByIdAndDelete(id).lean();

    return removedUser;
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({ username }).lean();
    if (!user) throw new BadRequestException('el usuario no existe');
    return user;
  }
}
