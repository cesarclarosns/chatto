import { CorsOptions } from 'cors'

const allowedOrigins = [
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4000',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://enroudesk.cesarclarosns.com',
]

export const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    //Allow requests with no origin
    if (!origin) return cb(null, true)

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        'The CORS policy for this site does not allow access from the specified origin.'
      return cb(new Error(msg), false)
    }

    return cb(null, true)
  },
  credentials: true,
}
