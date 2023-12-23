import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users-dto';
import { IncreaseUserMetadataDto } from './dto/increase-user-metadata.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TUserFilterQuery, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async findAll(findAllUsersDto: FindAllUsersDto) {
    return await this.userModel.find(findAllUsersDto);
  }

  async findOne(filter: TUserFilterQuery) {
    return await this.userModel.findOne(filter);
  }

  async findOneById(id: string) {
    return await this.userModel.findById(id);
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findOneByGoogleId(google_id: string) {
    return await this.userModel.findOne({ google_id });
  }

  async findOneUserInfoById(id: string) {
    return await this.userModel.findOne(
      { _id: id },
      { metadata: 0, password: 0 },
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: id }, { $set: updateUserDto });
  }

  async findOneUserProfileByUsername(username: string) {
    return await this.userModel.findOne({ username }, { password: 0 });
  }

  async increaseUserMetadata(
    id: string,
    increaseUserMetadataDto: IncreaseUserMetadataDto,
  ) {
    return await this.userModel.updateOne(
      { _id: id },
      { $inc: increaseUserMetadataDto },
    );
  }
}
