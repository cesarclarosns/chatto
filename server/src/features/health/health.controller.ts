import { RequestHandler, Router } from 'express'
import { StatusCodes } from 'http-status-codes'

export class HealthController {
  router: Router

  constructor() {
    this.router = Router()

    this.router.get('/', this.getHealth)
  }

  getHealth: RequestHandler = (req, res) => {
    res.status(StatusCodes.OK).send({
      status: 'up',
      uptime: process.uptime(),
      timestamp: new Date(Date.now()).toISOString(),
    })
  }
}

export const healthController = new HealthController()
