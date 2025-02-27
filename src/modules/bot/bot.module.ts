import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { sessionMiddleWare } from 'src/utils/sessionMiddleware';
import { UserModule } from 'src/pages/User/User.module';
import MenuModule from 'src/pages/Menu/Menu.module';
import WebhookModule from 'src/pages/Webhook/Webhook.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        token: config.get<string>('bot.token'),
        middlewares: [sessionMiddleWare],
        include: [UserModule, MenuModule, WebhookModule],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class BotModule {}
