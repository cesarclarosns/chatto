import { Secret, SignOptions, VerifyOptions, sign, verify } from 'jsonwebtoken'

export const signAsync = (
  payload: string | object | Buffer,
  secretOrPrivateKey: Secret,
  options: SignOptions,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    sign(payload, secretOrPrivateKey, options, (err, encoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(encoded)
      }
    })
  })
}

export const verifyAsync = (
  token: string,
  secretOrPrivateKey: Secret,
  options: VerifyOptions,
) => {
  return new Promise((resolve, reject) => {
    verify(token, secretOrPrivateKey, options, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}
