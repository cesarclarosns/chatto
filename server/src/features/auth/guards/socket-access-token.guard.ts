import { verifyAsync } from '@libs/jwt'
import { ICustomSocket } from '@common/interfaces/socket'
import { ExtendedError } from 'socket.io/dist/namespace'
import { CONFIG } from '@config'
import { TTokenPayload } from '../auth.types'

export const socketAccessTokenGuard = async (
  socket: ICustomSocket,
  next: (err?: ExtendedError) => void,
) => {
  try {
    const accessToken = socket.handshake.headers['authorization']?.slice(7)
    const payload = (await verifyAsync(
      accessToken,
      CONFIG.auth.accessTokenSecret,
      {},
    )) as TTokenPayload
    socket.data = payload

    next()
  } catch (err) {
    console.log('err:', err)

    next(err)
  }
}
