import { RequestHandler } from 'express'
import passport from 'passport'
import { AUTH_STRATEGIES } from '../auth.constants'
import { TTokenPayload } from '../auth.types'
import { HttpException } from '@common/classes/http-exception'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const refreshTokenGuard: RequestHandler = (req, res, next) => {
  passport.authenticate(
    AUTH_STRATEGIES.refreshToken,
    (err: Error, user: TTokenPayload) => {
      if (err) return next(err)
      if (!user) {
        throw new HttpException({
          statusCode: StatusCodes.UNAUTHORIZED,
          message: ReasonPhrases.UNAUTHORIZED,
        })
      }
      next()
    },
  )(req, res, next)
}
