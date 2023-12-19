import { ErrorRequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { JsonWebTokenError } from 'jsonwebtoken'
import { Error as MongooseError } from 'mongoose'
import { ZodError } from 'zod'
import {
  HttpException,
  THttpExceptionPayload,
} from '@common/classes/http-exception'

export const exceptionHandler: ErrorRequestHandler = (err, req, res, next) => {
  let payload: THttpExceptionPayload

  if (err instanceof HttpException) {
    payload = err.payload
    return res.status(err.payload.statusCode).send(payload)
  }

  if (err instanceof JsonWebTokenError) {
    payload = {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: err.message,
    }
    return res.status(StatusCodes.UNAUTHORIZED).send(payload)
  }

  if (err instanceof MongooseError.ValidationError) {
    payload = {
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      message: err.message,
      errors: err.errors as any,
    }
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(payload)
  }

  if (err instanceof ZodError) {
    const errors: THttpExceptionPayload['errors'] = {}
    Object.entries(err.format()).forEach(([k, v]) => {
      if (k != '_errors') {
        errors[k] = v['_errors']
      }
    })

    payload = {
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      errors,
    }
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(payload)
  }

  if (err) {
    payload = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(payload)
  }

  next()
}
