import { Router } from 'express'

export class SubscriptionsController {
  router: Router

  constructor() {
    this.router = Router()
  }
}

export const subscriptionsController = new SubscriptionsController()
