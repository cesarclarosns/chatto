import { Router } from 'express'
import { accessTokenGuard } from '../auth/guards/access-token.guard'

export class PostsController {
  router: Router

  constructor() {
    this.router = Router()

    this.router.use(accessTokenGuard)

    this.router.get('/')
    this.router.post('/')
    this.router.get('/:post_id')
    this.router.patch('/:post_id')
    this.router.delete('/:post_id')
    this.router.post('/:post_id/likes')
    this.router.delete('/:post_id/likes')
    this.router.get('/:post_id/comments')
    this.router.post('/:post_id/comments')
    this.router.patch('/:post_id/comments/:comment_id')
    this.router.delete('/:post_id/comments/:comment_id')
  }

  findAll() {}
  findOne() {}
  update() {}
  create() {}
  delete() {}

  createPostLike() {}
  deletePostLike() {}

  findAllPostComments() {}
  createPostComment() {}
  updatePostComment() {}
  deletePostComment() {}
}

export const postsController = new PostsController()
