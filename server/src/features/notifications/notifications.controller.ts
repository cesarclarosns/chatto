import { RequestHandler, Router } from 'express'
import {
  NotificationsService,
  notificationsService,
} from './notifications.service'
import passport from 'passport'
import { AUTH_STRATEGIES } from '../auth/auth.constants'

export class NotificationsController {
  router: Router
  private readonly notificationsService: NotificationsService

  constructor() {
    this.router = Router()
    this.notificationsService = notificationsService

    this.router.use(passport.authenticate(AUTH_STRATEGIES.accessToken))

    this.router.get('/', this.findAll)
    this.router.patch('/:id', this.update)
    this.router.delete('/:id', this.delete)
  }

  findAll: RequestHandler = (req, res) => {
    console.log(req, res)
  }

  update: RequestHandler = (req, res) => {
    console.log(req, res)
  }

  delete: RequestHandler = (req, res) => {
    console.log(req, res)
  }
}
