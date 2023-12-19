import { createClient } from 'redis'

export const redisClient = createClient({})

// redisClient.on('error', (err) => console.log('Redis Client Error', err))

export const connectCache = async () => {
  try {
    await redisClient.connect()
    console.log('Connected to cache')
  } catch (err) {
    console.log('Error connecting to cache')
    throw err
  }
}
