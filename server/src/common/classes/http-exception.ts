import { StatusCodes } from 'http-status-codes'

export type THttpExceptionPayload = {
  errors?: { [key: string]: string | string[] }
  statusCode: StatusCodes
  message?: string | string[]
}

export class HttpException extends Error {
  payload: THttpExceptionPayload
  constructor(payload: THttpExceptionPayload) {
    super()
    this.payload = payload
  }
}
