import { CONFIG } from '@config'
import { rateLimit } from 'express-rate-limit'

export const rateLimiter = rateLimit({
  limit: CONFIG.rateLimiter.limit,
})
