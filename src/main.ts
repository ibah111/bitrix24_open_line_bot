import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getSwaggerCustomOptions, getSwaggerOptions } from './utils/swagger';
import { SqliteDatabaseSeed } from './modules/database/sqlite.database/seed';
import { AppModule } from './app.module';
import { Telegraf } from 'telegraf';
import 'colors';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import https from './utils/https';

export const bot = new Telegraf(process.env.BOT_TOKEN);

export const node = process.env.NODE_ENV;

class bootstrapOptions {
  constructor() {
    this.adapter =
      node === 'prod'
        ? new FastifyAdapter({
            https: https()!,
          })
        : new FastifyAdapter();
  }
  adapter: FastifyAdapter;
}

async function bootstrap() {
  const options = new bootstrapOptions();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    options.adapter,
  );
  const config = new DocumentBuilder()
    .setVersion('1.0.0')
    .addTag('NBK_BOT')
    .build();
  const document = SwaggerModule.createDocument(
    app,
    config,
    getSwaggerOptions(),
  );
  SwaggerModule.setup('docs', app, document, getSwaggerCustomOptions());
  await app.get(SqliteDatabaseSeed).sync();
  await app.listen(4500, '0.0.0.0');
  console.log(`Server running on ` + `${await app.getUrl()}/docs`.yellow);
  console.log(`Bot launched`);
}
bootstrap();
