import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { CONFIG } from '@config'

import { AUTH_STRATEGIES } from '../auth.constants'

passport.use(
  AUTH_STRATEGIES.accessToken,
  new JwtStrategy(
    {
      secretOrKey: CONFIG.auth.accessTokenSecret,
      jwtFromRequest: (req) => {
        return req.headers['authorization']?.slice(7)
      },
    },
    (payload, done) => {
      done(null, payload)
    },
  ),
)
