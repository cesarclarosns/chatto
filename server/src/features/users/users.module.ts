import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '@features/users/schemas/user.schema'
import { UsersController } from '@features/users/users.controller'
import { UsersGateway } from '@features/users/users.gateway'
import { UsersService } from '@features/users/users.service'

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UsersService, UsersGateway],
})
export class UsersModule {}
