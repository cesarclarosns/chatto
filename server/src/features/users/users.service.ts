import { TCreateUserDto } from './dto/create-user.dto'
import { TUpdateUserDto } from './dto/update-user.dto'
import { TUserDocumentFilterQuery, userModel } from './models/user.model'

export class UsersService {
  private readonly userModel: typeof userModel

  constructor() {
    this.userModel = userModel
  }

  findOne = async (filter: TUserDocumentFilterQuery) => {
    return await this.userModel.findOne(filter)
  }

  findOneById = async (id: string) => {
    return await this.userModel.findById(id)
  }

  findOneByEmail = async (email: string) => {
    return await this.userModel.findOne({ email })
  }

  findOneByGoogleId = async (google_id: string) => {
    return await this.userModel.findOne({ google_id })
  }

  findOneUserProfileById = async (id: string) => {
    return await this.userModel.findById(id, { password: 0, email: 0 })
  }

  findOneUserProfileByUsername = async (username: string) => {
    return await this.userModel.findOne({ username }, { password: 0, email: 0 })
  }

  findOneUserInfoById = async (id: string) => {
    return await this.userModel.findById(id)
  }

  findAll = async ({}: {
    filter: TUserDocumentFilterQuery
    limit: number
    skip: number
    sort: string
  }) => {
    return await this.userModel.find({})
  }

  update = async (id: string, updateUserDto: TUpdateUserDto) => {
    return await this.userModel.updateOne({ _id: id }, { $set: updateUserDto })
  }

  create = async (createUserDto: TCreateUserDto) => {
    return await this.userModel.create(createUserDto)
  }
}

export const usersService = new UsersService()
