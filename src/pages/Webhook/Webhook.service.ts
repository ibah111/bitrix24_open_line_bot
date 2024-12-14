import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { InjectBot } from 'nestjs-telegraf';
import { lastValueFrom } from 'rxjs';
import InstallModel from 'src/modules/database/sqlite.database/models/Install.model';
import { Telegraf } from 'telegraf';

@Injectable()
export default class WebhookService implements OnModuleInit {
  bot: Telegraf;
  private readonly bitrixWebhook: string;
  private readonly openlineCode: string;

  constructor(
    @InjectModel(InstallModel, 'sqlite')
    private readonly installModel: typeof InstallModel,
    @InjectBot() bot: Telegraf,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.bot = bot;
    this.bitrixWebhook = this.configService.get<string>('BITRIX_WEBHOOK');
    this.openlineCode = this.configService.get<string>('OPENLINE_CODE');
  }
  onModuleInit() {
    console.log(`${this.bitrixWebhook}, ${this.openlineCode}`.yellow);
    this.bot.on('text', async (ctx) => {
      const message = ctx.message.text;
      if (message.startsWith('/to_b24')) {
        const content = message.replace('/to_b24', '').trim();

        if (!content) {
          return ctx.reply('Введите текст сообщения после команды /to_b24.');
        }

        try {
          const chat = {
            id: ctx.chat.id,
          };
          const message = {
            id: `${ctx.chat.id}-${ctx.message.message_id}`,
            text: ctx.message.text,
            date: ctx.message.date,
          };
          const user = {
            id: ctx.from.id,
            name: `${ctx.from.first_name} ${ctx.from.last_name}`,
          };
          const install_instance = await this.installModel.findOne();
          const access_token = install_instance.auth_access_token;
          const hash = install_instance.auth_application_token;

          await this.sendToBitrix(access_token, user, message, chat, hash);
          ctx.reply('Сообщение отправлено в открытую линию Битрикс24!');
        } catch (error) {
          console.error('Ошибка отправки:'.red, error.message);
          console.log(error);
          ctx.reply('Ошибка при отправке сообщения в Битрикс24.');
        }
      } else {
        ctx.reply(
          'Используйте команду /to_b24 для отправки сообщения в Битрикс24.',
        );
      }
    });
  }

  private async sendToBitrix(access_token: string, user, message, chat, hash) {
    console.log('sending message access_token', access_token);

    const payload = {
      LINE: 29,
      CONNECTOR: 'openlinechatbot',
      MESSAGES: [
        {
          user,
          message,
          chat,
        },
      ],
    };
    try {
      const request = await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}/imconnector.send.messages?auth=${access_token}&hash=${hash}`,
          payload,
        ),
      );
      console.log(request.data.result.DATA.RESULT);
    } catch (error) {
      console.log('error: '.red, error);
      throw Error();
    }
  }
}
