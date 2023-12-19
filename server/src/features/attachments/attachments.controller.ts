import { RequestHandler, Router } from 'express'
import passport from 'passport'
import { AUTH_STRATEGIES } from '../auth/auth.constants'

export class AttachmentsController {
  router: Router

  constructor() {
    this.router = Router()

    this.router.use(passport.authenticate(AUTH_STRATEGIES.accessToken))

    this.router.post('/', this.create)
  }

  create: RequestHandler = (req, res) => {
    console.log(req, res)
  }
}

export const attachmentsController = new AttachmentsController()
