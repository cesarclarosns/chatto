import mongoose from 'mongoose'
import { CONFIG } from '@config'

export const connectDatabase = async () => {
  try {
    await mongoose.connect(CONFIG.database.uri)
    console.log('Connected to database')
  } catch (err) {
    console.log('Error connecting to database')
    throw err
  }
}
