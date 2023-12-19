import { Router } from 'express'

export class FollowersController {
  router: Router

  constructor() {
    this.router = Router()
  }
}

export const followersController = new FollowersController()
