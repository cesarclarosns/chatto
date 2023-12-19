import { RequestHandler, Router } from 'express'
import { UsersService, usersService } from './users.service'
import { accessTokenGuard } from '../auth/guards/access-token.guard'

export class UsersController {
  router: Router
  private readonly usersService: UsersService

  constructor() {
    this.router = Router()
    this.usersService = usersService

    this.router.get('/', this.findAll)
    this.router.get('/me', accessTokenGuard, this.findMyUserInfo)
    this.router.patch('/me', accessTokenGuard, this.update)
    this.router.get('/:username/profile', this.findOneUserProfile)
    this.router.get('/:user_id/reviews', this.findAllUserRewiews)
    this.router.post(
      '/:user_id/reviews',
      accessTokenGuard,
      this.createUserReview,
    )
    this.router.patch(
      '/:user_id/reviews/:review_id',
      accessTokenGuard,
      this.updateUserReview,
    )
    this.router.get('/:user_id/ratings', this.findAllUserRatings)
    this.router.get(
      '/:user_id/ratings/me',
      accessTokenGuard,
      this.findMyUserRating,
    )
    this.router.put(
      '/:user_id/ratings/me',
      accessTokenGuard,
      this.updateMyUserRating,
    )
  }

  findAll: RequestHandler = () => {}

  findMyUserInfo: RequestHandler = () => {}

  findOneUserProfile: RequestHandler = () => {}

  update: RequestHandler = () => {}

  findAllUserRewiews: RequestHandler = () => {}

  createUserReview: RequestHandler = () => {}

  updateUserReview: RequestHandler = () => {}

  findAllUserRatings: RequestHandler = (req, res) => {
    console.log(req, res)
  }

  findOneUserRating: RequestHandler = () => {}

  findMyUserRating: RequestHandler = (req, res) => {
    const { sub: rater_id } = (req as any).user
    const { user_id } = req.params

    console.log({ rater_id, user_id, res })
  }

  updateMyUserRating: RequestHandler = (req, res) => {
    const { sub: rater_id } = (req as any).user
    const { user_id } = req.params

    console.log({ rater_id, user_id, res })
  }
}

export const usersController = new UsersController()
