import { ConfigService } from '@nestjs/config'
import { JsonWebTokenError } from 'jsonwebtoken'
import * as jsonwebtoken from 'jsonwebtoken'
import { CONFIG_VALUES } from '@app/config/configuration'
import ICustomSocket from '@common/interfaces/socket.io/custom-socket.interface'
import { TTokenPayload } from '@features/auth/auth.types'

export const socketAuthMiddleware =
  (configService: ConfigService) =>
  (socket: ICustomSocket, next: (err?: any) => void) => {
    try {
      const jwt = socket.handshake.headers.authorization?.slice(7)
      const payload = jsonwebtoken.verify(
        jwt,
        configService.getOrThrow<string>(CONFIG_VALUES.auth.jwtAccessSecret),
      ) as TTokenPayload

      socket.data = payload

      next()
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        const error = new Error(err.message)
        next(error)
      } else {
        const error = new Error('Internal server error')
        next(error)
      }
    }
  }
