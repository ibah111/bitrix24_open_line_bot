import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import axios from 'axios';
import { InjectBot } from 'nestjs-telegraf';
import { lastValueFrom } from 'rxjs';
import InstallModel from 'src/modules/database/sqlite.database/models/Install.model';
import { Telegraf } from 'telegraf';
import fs, { access } from 'fs';
import { Message, Chat, User } from './BitrixTypes';
import { WebhookController } from './Webhook.controller';

@Injectable()
export default class WebhookService {
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

  public async sendToBitrix(user: User, message: Message, chat: Chat) {
    const installModel = await this.installModel.findOne();
    const access_token = installModel.auth_access_token;
    const hash = installModel.auth_application_token;
    const payload = {
      LINE: this.openlineCode,
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
