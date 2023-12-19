import { httpServer } from './app'
import { connectDatabase } from './db'
// import { connectCache } from './cache'
import { CONFIG } from '@config/index'

const bootstrap = async () => {
  await connectDatabase()
  // await connectCache()
  httpServer.listen(CONFIG.app.listeningPort, () => {
    console.log(`Server listening on port ${CONFIG.app.listeningPort}`)
  })
}

bootstrap()
