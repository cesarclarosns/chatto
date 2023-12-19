import { Router } from 'express'
import { healthController } from '@features/health/health.controller'
import { authController } from '@features/auth/auth.controller'
import { usersController } from '@features/users/users.controller'
import { paymentsController } from '@features/payments/payments.controller'
import { postsController } from '@features/posts/posts.controller'
import { chatsController } from '@features/chats/chats.controller'
import { roomsController } from '@features/rooms/rooms.controller'
import { attachmentsController } from '@features/attachments/attachments.controller'
import { subscriptionsController } from '@features/subscriptions/subscriptions.controller'
import { followersController } from '@features/followers/followers.controller'

export const router = Router()

router.use('/health', healthController.router)
router.use('/auth', authController.router)
router.use('/users', usersController.router)
router.use('/payments', paymentsController.router)
router.use('/posts', postsController.router)
router.use('/chats', chatsController.router)
router.use('/rooms', roomsController.router)
router.use('/attachments', attachmentsController.router)
router.use('/subscriptions', subscriptionsController.router)
router.use('/followers', followersController.router)
