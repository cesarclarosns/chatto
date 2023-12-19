import { RequestHandler, Router } from 'express'
import { PaymentsService, paymentsService } from './payments.service'
import passport from 'passport'
import { AUTH_STRATEGIES } from '../auth/auth.constants'

export class PaymentsController {
  router: Router
  private readonly paymentsService: PaymentsService

  constructor() {
    this.router = Router()
    this.paymentsService = paymentsService

    this.router.use(passport.authenticate(AUTH_STRATEGIES.accessToken))

    this.router.get('/:payment_id', this.findOne)
    this.router.post('/messages/:message_id', this.createMessagePayment)
    this.router.post('/posts/:post_id', this.createPostPayment)
    this.router.post(
      '/users-subscription/:user_id',
      this.createUserSubscriptionPayment,
    )
    this.router.post(
      '/platform-subscription/:user_id',
      this.createPlatformSubscriptionPayment,
    )
  }

  findOne: RequestHandler = (req, res) => {
    const { id } = req.params
    this.paymentsService.findOne(id)
    res.send()
  }

  createMessagePayment: RequestHandler = () => {}

  createUserSubscriptionPayment: RequestHandler = () => {}

  createPostPayment: RequestHandler = () => {}

  createPlatformSubscriptionPayment: RequestHandler = () => {}
}

export const paymentsController = new PaymentsController()
