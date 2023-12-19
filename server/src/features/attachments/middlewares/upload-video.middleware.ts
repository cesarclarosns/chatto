import { RequestHandler } from 'express'

export const uploadVideoMiddleware: RequestHandler = () => {
  console.log('uploadVideoMiddleware')
}
