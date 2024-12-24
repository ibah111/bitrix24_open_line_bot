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
      console.log('document: ', ctx.message.document);
      const document = ctx.message.document;
      const file_id = document.file_id;
      const getLink = await ctx.telegram.getFileLink(file_id);
      console.log('getLink', getLink);
      const URL = getLink.href;
      const NAME = document.file_name;
      const chat = {
        id: ctx.chat.id,
      };
      const message = {
        id: `${ctx.chat.id}-${ctx.message.message_id}`,
        text: `Пользователь ${ctx.from.first_name} ${ctx.from.last_name} прислал документ.`,
        date: ctx.message.date,
        files: [
          {
            URL,
            NAME,
          },
        ],
      };
      const avatars = await ctx.telegram.getUserProfilePhotos(ctx.chat.id);
      let picture;
      if (avatars.total_count > 0) {
        const photo = avatars.photos[0][0];
        const photo_id = photo.file_id;
        const file_link = await ctx.telegram.getFileLink(photo_id);
        picture = {
          url: file_link,
        };
      }
      const user = {
        id: ctx.from.id,
        name: `${ctx.from.first_name} ${ctx.from.last_name}`,
        picture,
      };
      await this.sendToBitrix(access_token, user, message, chat, hash);
    });
    /**
     * photo
     */
    this.bot.on('photo', async (ctx) => {
      const chat = {
        id: ctx.chat.id,
      };
      const avatars = await ctx.telegram.getUserProfilePhotos(ctx.chat.id);
      let picture;
      if (avatars.total_count > 0) {
        const photo = avatars.photos[0][0];
        const photo_id = photo.file_id;
        const file_link = await ctx.telegram.getFileLink(photo_id);
        picture = {
          url: file_link,
        };
      }
      const user = {
        id: ctx.from.id,
        name: `${ctx.from.first_name} ${ctx.from.last_name}`,
        picture,
      };
      const photo = ctx.message.photo;
      const photoId = photo[photo.length - 1].file_id;
      const getLink = await ctx.telegram.getFileLink(photoId);
      const str_arr = getLink.href.split('/');
      const NAME = str_arr[str_arr.length - 1];
      const URL = getLink.href;
      const message = {
        id: `${ctx.chat.id}-${ctx.message.message_id}`,
        text: `Пользователь ${ctx.from.first_name} ${ctx.from.last_name} прислал изображение.`,
        date: ctx.message.date,
        files: [
          {
            URL,
            NAME,
          },
        ],
      };
      await this.sendToBitrix(access_token, user, message, chat, hash);
    });

    /**
     * text
     */
    this.bot.on('text', async (ctx) => {
      const message = ctx.message.text;
      if (message) {
        try {
          const chat = {
            id: ctx.chat.id,
          };
          const message = {
            id: `${ctx.chat.id}-${ctx.message.message_id}`,
            text: ctx.message.text,
            date: ctx.message.date,
          };
          const avatars = await ctx.telegram.getUserProfilePhotos(ctx.chat.id);
          let picture;
          if (avatars.total_count > 0) {
            const photo = avatars.photos[0][0];
            const photo_id = photo.file_id;
            const file_link = await ctx.telegram.getFileLink(photo_id);
            picture = {
              url: file_link,
            };
          }
          const user = {
            id: ctx.from.id,
            name: `${ctx.from.first_name} ${ctx.from.last_name}`,
            picture,
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

  private async sendToBitrix(access_token: string, user, message, chat, hash) {
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
      return await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}/imconnector.send.messages?auth=${access_token}&hash=${hash}`,
          payload,
        ),
      );
    } catch (error) {
      console.log('error: '.red, error);
      throw Error();
    }
  }
}
