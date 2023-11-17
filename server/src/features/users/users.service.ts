import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SocketService } from '@app/common/modules/socket/socket.service'
import { CreateUserDto } from '@features/users/dto/create-user.dto'
import { UpdateUserDto } from '@features/users/dto/update-user.dto'
import { User, UserDocument } from '@features/users/schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private socketService: SocketService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: id }, updateUserDto)
  }

  async findAll() {
    return await this.userModel.find({}, { password: 0 })
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ username })
  }

  async findOneByGoogleId(googleId: string) {
    return await this.userModel.findOne({ googleId })
  }

  async findOneById(id: string) {
    return await this.userModel.findById(id)
  }

  async getProfileByUsername(username: string) {
    return await this.userModel.findOne({ username }, { password: 0 })
  }

  async getOnlineUsers(): Promise<number> {
    return new Set(
      (await this.socketService.server.sockets.fetchSockets()).map(
        (socket) => socket.data.sub,
      ),
    ).size
  }

  getUserChannel(userId: string) {
    return `users:${userId}`
  }
}
