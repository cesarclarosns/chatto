import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { CONFIG } from '@config'
import { COOKIES, AUTH_STRATEGIES } from '../auth.constants'

passport.use(
  AUTH_STRATEGIES.refreshToken,
  new JwtStrategy(
    {
      secretOrKey: CONFIG.auth.accessTokenSecret,
      jwtFromRequest: (req) => {
        return req.cookies[COOKIES.refreshToken]
      },
    },
    (payload, done) => {
      done(null, payload)
    },
  ),
)
