import * as Joi from 'joi'

export const CONFIG_VALUES = {
  app: {
    apiPath: 'app.apiPath',
    appDomain: 'app.appDomain',
    gatewayPath: 'app.gatewayPath',
    listeningPort: 'app.listeningPort',
    liveKitApiKey: 'app.liveKitApiKey',
    liveKitHost: 'app.liveKitHost',
    liveKitSecretKey: 'app.liveKitSecretKey',
  },
  auth: {
    jwtAccessExpiresIn: 'auth.jwtAccessExpiresIn',
    jwtAccessSecret: 'auth.jwtAccessSecret',
    jwtRefreshExpiresIn: 'auth.jwtRefreshExpiresIn',
    jwtRefreshSecret: 'auth.jwtRefreshSecret',
    jwtResetPasswordExpiresIn: 'auth.jwtResetPasswordExpiresIn',
    jwtResetPasswordSecret: 'auth.jwtResetPasswordSecret',
  },
  database: {
    uri: 'database.uri',
  },
  throttler: {
    limit: 'throttler.limit',
    ttl: 'throttler.ttl',
  },
}

export const configValidationSchema = Joi.object({
  API_PATH: Joi.string().required(),
  APP_DOMAIN: Joi.string().required(),
  GATEWAY_PATH: Joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_RESET_PASSWORD_EXPIRES_IN: Joi.string().required(),
  JWT_RESET_PASSWORD_SECRET: Joi.string().required(),
  LISTENING_PORT: Joi.number().equal(5000).required(),
  LIVEKIT_API_KEY: Joi.string().required(),
  LIVEKIT_HOST: Joi.string().required(),
  LIVEKIT_SECRET_KEY: Joi.string().required(),
  MONGODB_URI: Joi.string().required(),
  THROTTLE_LIMIT: Joi.number().required(),
  THROTTLE_TTL: Joi.number().required(),
})

export default () => ({
  app: {
    apiPath: process.env.API_PATH,
    appDomain: process.env.APP_DOMAIN,
    gatewayPath: process.env.GATEWAY_PATH,
    listeningPort: parseInt(process.env.LISTENING_PORT),
    liveKitApiKey: process.env.LIVEKIT_API_KEY,
    liveKitHost: process.env.LIVEKIT_HOST,
    liveKitSecretKey: process.env.LIVEKIT_SECRET_KEY,
  },
  auth: {
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtResetPasswordExpiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    jwtResetPasswordSecret: process.env.JWT_RESET_PASSWORD_SECRET,
  },
  database: {
    uri: process.env.MONGODB_URI,
  },
  throttler: {
    limit: parseInt(process.env.THROTTLE_LIMIT),
    ttl: parseInt(process.env.THROTTLE_TTL),
  },
})
