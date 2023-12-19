import express from 'express'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { createServer } from 'http'
import { Server } from 'socket.io'
import helmet from 'helmet'
import { router } from './routers'
import cors from 'cors'
import { CONFIG } from '@config'
import { ICustomServer } from '@common/interfaces/socket'
import { corsOptions } from '@config/cors.config'
import { usersGateway } from '@features/users/users.gateway'
import { roomsGateway } from '@features/rooms/rooms.gateway'
import { chatsGateway } from '@features/chats/chats.gateway'
import { socketAccessTokenGuard } from '@features/auth/guards/socket-access-token.guard'
import { exceptionHandler } from '@middlewares/exception-handler.middleware'
import { rateLimiter } from '@middlewares/rate-limiter.middleware'
import { logger } from '@middlewares/logger.middleware'
import '@features/auth/strategies'

export const app = express()

app.use(logger)
app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())
app.use(rateLimiter)
app.use(passport.initialize())

app.use(`${CONFIG.app.apiPrefix}`, router)

app.use(exceptionHandler)

export const httpServer = createServer(app)

export const io = new Server<ICustomServer>(httpServer, {
  path: CONFIG.app.apiSocketPath,
  cors: corsOptions,
})

io.use(socketAccessTokenGuard)

io.on('connection', (socket) => {
  chatsGateway.init(socket)
  roomsGateway.init(socket)
  usersGateway.init(socket)
})
