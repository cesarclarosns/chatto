import { Router } from 'express'
import { AuthService, authService } from './auth.service'

import { StatusCodes } from 'http-status-codes'
import { COOKIES } from './auth.constants'
import { CONFIG } from '@config'

import { asyncHandler } from '@libs/async-handler'
import { signInDtoSchema } from './dto/sign-in.dto'
import { signUpDtoSchema } from './dto/sign-up.dto'
import { refreshTokenGuard } from './guards/refresh-token.guard'
import { googleGuard } from './guards/google.guard'

export class AuthController {
  router: Router
  authService: AuthService

  constructor() {
    this.router = Router()
    this.authService = authService

    this.router.post('/sign-in', this.signIn)
    this.router.post('/sign-up', this.signUp)
    this.router.post('/sign-out', refreshTokenGuard, this.signOut)
    this.router.get('/refresh', refreshTokenGuard, this.refresh)
    this.router.post('/reset-password', this.resetPassword)
    this.router.get('/reset-password/callback', this.resetPasswordCallback)
    this.router.post('/google', googleGuard)
    this.router.post('/google/callback', googleGuard, this.googleCallback)
  }

  signIn = asyncHandler(async (req, res) => {
    const signInDto = signInDtoSchema.parse(req.body)
    const tokens = await this.authService.signIn(signInDto)

    res.cookie(COOKIES.refreshToken, tokens.refreshToken, { httpOnly: true })
    res.cookie(COOKIES.persist, true)
    res.status(StatusCodes.OK).send({ accessToken: tokens.accessToken })
  })

  signUp = asyncHandler(async (req, res) => {
    const signUpDto = signUpDtoSchema.parse(req.body)
    await this.authService.signUp(signUpDto)

    res.status(StatusCodes.OK).send()
  })

  signOut = asyncHandler(async (req, res) => {
    res.clearCookie(COOKIES.refreshToken, { httpOnly: true })
    res.clearCookie(COOKIES.persist)
    res.status(StatusCodes.OK).send()
  })

  refresh = asyncHandler(async (req, res) => {
    const user_id = req.user.sub
    const tokens = await this.authService.refreshTokens(user_id)

    res.cookie(COOKIES.refreshToken, tokens.refreshToken, { httpOnly: true })
    res.status(StatusCodes.OK).send({ accessToken: tokens.accessToken })
  })

  resetPassword = asyncHandler(async (req, res) => {
    await this.authService.resetPassword(req.body)
    res.status(StatusCodes.OK).send()
  })

  resetPasswordCallback = asyncHandler(async (req, res) => {
    const { token } = req.query as { token: string }
    await this.authService.resetPasswordCallback(req.body, token)
    res.status(StatusCodes.OK).send()
  })

  googleCallback = asyncHandler(async (req, res) => {
    try {
      const { sub: user_id } = req.user
      const tokens = await authService.getTokens(user_id)

      res.cookie(COOKIES.persist, true)
      res.cookie(COOKIES.refreshToken, tokens.refreshToken, { httpOnly: true })
    } catch (err) {
    } finally {
      res.redirect(CONFIG.app.appDomain)
    }
  })
}

export const authController = new AuthController()
