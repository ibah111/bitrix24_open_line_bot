import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import axios from 'axios';
import { InjectBot } from 'nestjs-telegraf';
import { lastValueFrom } from 'rxjs';
import InstallModel from 'src/modules/database/sqlite.database/models/Install.model';
import { Telegraf } from 'telegraf';
import fs from 'fs';

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
  async onModuleInit() {
    const install_instance = await this.installModel.findOne();
    const access_token = install_instance.auth_access_token;
    const hash = install_instance.auth_application_token;

    //on document
    this.bot.on('document', async (ctx) => {
      console.log(document);
      const chat = {
        id: ctx.chat.id,
      };
      const message = {
        id: `${ctx.chat.id}-${ctx.message.message_id}`,
        text: `Пользователь ${ctx.from.first_name} ${ctx.from.last_name} прислал документ.`,
        date: ctx.message.date,
      };
      const user = {
        id: ctx.from.id,
        name: `${ctx.from.first_name} ${ctx.from.last_name}`,
      };

      const file_id = ctx.message.document.file_id;
      const file_url = await ctx.telegram.getFileLink(file_id);
      const fileName = ctx.message.document.file_name;
      const writer = fs.createWriteStream(fileName);
      const responce = await axios.get(file_url.href, {
        responseType: 'stream',
      });
    });
    /**
     * photo
     */
    this.bot.on('photo', async (ctx) => {
      const chat = {
        id: ctx.chat.id,
      };
      const message = {
        id: `${ctx.chat.id}-${ctx.message.message_id}`,
        text: `Пользователь ${ctx.from.first_name} ${ctx.from.last_name} прислал изображение.`,
        date: ctx.message.date,
      };
      const user = {
        id: ctx.from.id,
        name: `${ctx.from.first_name} ${ctx.from.last_name}`,
      };
      const files = {};
      const photo = ctx.message.photo;
      const photoId = photo[photo.length - 1].file_id;
      const fileUrl = await ctx.telegram.getFileLink(photoId);
      await this.sendToBitrix(
        access_token,
        user,
        message,
        chat,
        hash,
        fileUrl.href,
      );
      console.log('photo: ', photo, '\nfileUrl; ', fileUrl);
    });

    /**
     * text
     */
    this.bot.on('text', async (ctx) => {
      console.log(ctx);
      const message = ctx.message.text;
      if (message) {
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

  async uploadFile(access_token: string) {
    const payload = {};
    try {
      await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}disk.folder.uploadfile?auth=${access_token}`,
          payload,
        ),
      );
    } catch (error) {}
  }

  private async sendToBitrix(
    access_token: string,
    user,
    message,
    chat,
    hash,
    file_url?,
  ) {
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
