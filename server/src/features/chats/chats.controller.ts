import { RequestHandler, Router } from 'express'
import passport from 'passport'
import { AUTH_STRATEGIES } from '@features/auth/auth.constants'

class ChatsController {
  router: Router

  constructor() {
    this.router = Router()

    this.router.use(passport.authenticate(AUTH_STRATEGIES.accessToken))

    this.router.post('/mass_message', this.createMassMessage)
    this.router.get('/:chat_id/messages', this.findAll)
    this.router.get(
      '/:chat_id/last-read-message-per-user',
      this.findAllLastReadMessagePerUser,
    )
  }

  findAll: RequestHandler = (req, res) => {
    console.log(req, res)
  }

  findAllLastReadMessagePerUser: RequestHandler = (req, res) => {
    console.log(req, res)
  }

  createMassMessage: RequestHandler = (req, res) => {
    console.log(req, res)
  }
}

export const chatsController = new ChatsController()
