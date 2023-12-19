import mongoose from 'mongoose'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { CONFIG } from '@config'
import { authService } from '../auth.service'
import { usersService } from '@features/users/users.service'
import { AUTH_STRATEGIES } from '../auth.constants'

passport.use(
  AUTH_STRATEGIES.google,
  new GoogleStrategy(
    {
      clientID: CONFIG.auth.googleClientId,
      clientSecret: CONFIG.auth.googleClientSecret,
      callbackURL: CONFIG.auth.googleCallbackUrl,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await usersService.findOneByGoogleId(profile.id)

        if (!user) {
          const _id = new mongoose.Types.ObjectId().toString()
          const username = `u${_id}`
          const google_id = profile.id
          const profilePicture = profile.photos?.[0].value
          const displayName = profile.displayName

          user = await usersService.create({
            _id,
            username,
            google_id,
            profile: {
              displayName,
              ...(profilePicture && { profilePicture }),
            },
          })
        }
        const payload = authService.getTokenPayload(user.id)
        done(null, payload)
      } catch (err) {
        done(err, null)
      }
    },
  ),
)
