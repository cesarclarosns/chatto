import { RequestHandler } from 'express'
import passport from 'passport'
import { AUTH_STRATEGIES } from '../auth.constants'
import { CONFIG } from '@config'

export const googleGuard: RequestHandler = (req, res, next) => {
  passport.authenticate(AUTH_STRATEGIES.google, {
    prompt: 'select_account',
    failureRedirect: CONFIG.app.appDomain,
  })(req, res, next)
}
