import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { CreateUserDto } from '@features/users/dto/create-user.dto'
import { UpdateUserDto } from '@features/users/dto/update-user.dto'
import { UsersService } from '@features/users/users.service'
import { Public } from '../auth/decorators/public.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll()
  }

  @Public()
  @Get('online')
  async getOnlineUsers() {
    const count = await this.usersService.getOnlineUsers()
    return { count }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOneById(id)
  }

  @Public()
  @Get('profiles/:username')
  async findOneProfile(@Param('username') username: string) {
    const profile = await this.usersService.getProfileByUsername(username)
    if (!profile)
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND)

    return profile
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto)
  }
}
