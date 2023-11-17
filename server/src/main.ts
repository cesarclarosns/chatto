import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { AppModule } from '@app/app.module'
import { CONFIG_VALUES } from '@app/config/configuration'
import { MongooseExceptionFilter } from '@libs/filters/mongoose-exception.filter'
import { SocketIoAdapter } from './libs/adapters/socket-io.adapter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const configService = app.get(ConfigService)

  // Set up
  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new MongooseExceptionFilter())
  app.useWebSocketAdapter(new SocketIoAdapter(app, configService))
  app.use(helmet())
  app.use(cookieParser())

  const port = configService.getOrThrow<number>(CONFIG_VALUES.app.listeningPort)
  await app.listen(port)
}
bootstrap()
