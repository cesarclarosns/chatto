import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() findAllUsersDto: FindAllUsersDto) {
    return await this.usersService.findAll(findAllUsersDto);
  }

  @Get('me')
  async findMyUserInfo(@Req() req: Request) {
    const user_id = req.user.sub;
    return await this.usersService.findOneUserInfoById(user_id);
  }

  @Patch(':user_id')
  async update(
    @Param('user_id') user_id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(user_id, updateUserDto);
  }

  @Get(':username/profiles')
  async findOneUserProfile(@Param('username') username: string) {
    return await this.usersService.findOneUserProfileByUsername(username);
  }
}
