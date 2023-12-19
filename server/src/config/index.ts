import * as dotenv from 'dotenv'
import { z } from 'zod'

export const IS_PROD = process.env.NODE_ENV == 'production'
dotenv.config({ path: IS_PROD ? '.env' : '.env.development' })

export const configSchema = z
  .object({
    app: z.object({
      listeningPort: z.number(),
      apiPrefix: z.string(),
      apiSocketPath: z.string(),
      appDomain: z.string(),
      apiDomain: z.string(),
      smtpHost: z.string(),
      smtpUser: z.string(),
      smtpPass: z.string(),
      smtpEmal: z.string(),
      livekitHost: z.string(),
      livekitApiKey: z.string(),
      livekitSecretKey: z.string(),
    }),
    auth: z.object({
      accessTokenExpiresIn: z.string(),
      accessTokenSecret: z.string(),
      refreshTokenExpiresIn: z.string(),
      refreshTokenSecret: z.string(),
      resetPasswordTokenExpiresIn: z.string(),
      resetPasswordTokenSecret: z.string(),
      passwordSalt: z.string(),
      googleClientId: z.string(),
      googleClientSecret: z.string(),
      googleCallbackUrl: z.string(),
    }),
    rateLimiter: z.object({
      limit: z.number().min(10).max(15),
    }),
    database: z.object({
      uri: z.string(),
    }),
  })
  .passthrough()

export const CONFIG = configSchema.parse(<z.infer<typeof configSchema>>{
  app: {
    listeningPort: parseInt(process.env.LISTENING_PORT),
    apiPrefix: process.env.API_PREFIX,
    apiSocketPath: process.env.API_SOCKET_PATH,
    appDomain: process.env.APP_DOMAIN,
    apiDomain: process.env.API_DOMAIN,
    livekitHost: process.env.LIVEKIT_HOST,
    livekitApiKey: process.env.LIVEKIT_API_KEY,
    livekitSecretKey: process.env.LIVEKIT_SECRET_KEY,
    smtpHost: process.env.SMTP_HOST,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpEmal: process.env.SMTP_EMAIL,
  },
  auth: {
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    resetPasswordTokenExpiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN,
    resetPasswordTokenSecret: process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN,
    passwordSalt: process.env.PASSWORD_SALT,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  rateLimiter: {
    limit: parseInt(process.env.RATE_LIMITER_LIMIT),
  },
  database: {
    uri: process.env.MONGODB_URI,
  },
})
