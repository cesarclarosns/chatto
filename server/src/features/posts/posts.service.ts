import { usersService, UsersService } from '../users/users.service'

class PostsService {
  private readonly userPostAccessModel: undefined
  private readonly postCommentModel: undefined
  private readonly postLikeModel: undefined
  private readonly postModel: undefined

  private readonly usersService: UsersService

  constructor() {
    this.usersService = usersService
  }

  async createUserPostAccess(createUserPostAccessDto: {
    user_id: string
    post_id: string
  }) {
    console.log(createUserPostAccessDto)
  }

  async findOne() {}

  async findAll() {}

  async create() {}

  async update() {}

  async delete() {}
}

export const postsService = new PostsService()
