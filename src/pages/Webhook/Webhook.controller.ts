import { Body, Controller, OnModuleInit, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import WebhookService from './Webhook.service';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import InstallModel from 'src/modules/database/sqlite.database/models/Install.model';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { icon } from 'src/extensions/ext_exports';
import { Telegraf } from 'telegraf';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ImConnectorClass } from './Webhook.types';
import { InjectBot } from 'nestjs-telegraf';
import { formatText } from 'src/utils/textFormat';

export const install_return_example = {
  GENERAL: {
    HOST: '0.0.0.0',
    PORT: 3000,
    SSL_KEY: 'cert/private.key',
    SSL_CERT: 'cert/certificate.crt',
    DEBUG: true,
  },
  BITRIX: {
    TOKEN: '',
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    CONNECTOR_ID: 'openlinechatbot',
    CONNECTOR_NAME: 'Open line chatbot',
    PLACEMENT_HANDLER:
      'https://chat.nbkfinance.ru/apps/chatbotsconnector/javascript/handle.php?url=placement_handler',
    WIDGET_URI: 'https://chat.nbkfinance.ru/',
    WIDGET_NAME: 'OpenLineChatBot',
    EVENTS: [
      {
        name: 'OnImConnectorStatusDelete',
        handler:
          'https://chat.nbkfinance.ru/apps/chatbotsconnector/javascript/handle.php?url=on_status_delete',
      },
      {
        name: 'OnImConnectorMessageAdd',
        handler:
          'https://chat.nbkfinance.ru/apps/chatbotsconnector/javascript/handle.php?url=on_message_add',
      },
    ],
  },
  TELEGRAM: {
    TOKEN: '',
  },
};

@ApiTags('Bot')
@Controller('bot')
export class WebhookController implements OnModuleInit {
  bot: Telegraf;
  readonly bitrixWebhook: string =
    this.configService.get<string>('BITRIX_WEBHOOK');
  access_token: string;
  hash: string;
  connector: string = install_return_example.BITRIX.CONNECTOR_ID;
  open_line_id: number = 29;
  constructor(
    private readonly webhookService: WebhookService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectModel(InstallModel, 'sqlite')
    private readonly installModel: typeof InstallModel,
    @InjectBot() bot: Telegraf,
  ) {
    this.bot = bot;
  }

  async reinit_token() {
    const install_params = await this.installModel.findOne();
    const access_token = install_params.auth_access_token;
    const hash = install_params.auth_application_token;
    this.access_token = access_token;
    this.hash = hash;
  }

  async onModuleInit() {
    await this.refresh_tokens();
  }

  async instance_call(bitrixMethod: string, payload?: any) {
    try {
      const request = await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}${bitrixMethod}?auth=${this.access_token}`,
          payload,
        ),
      );
      console.log(
        'CALLING INSTANCE: ',
        bitrixMethod,
        '\nRequest data: ',
        request.data,
      );
      return request.data;
    } catch (error) {
      console.log(error);
    }
  }

  @Post()
  async entryPoint(@Body() body: any) {
    console.log('Entry point touched\nBODY', body);
  }

  @Post('install')
  async install(@Body() body: any) {
    console.log(body);
    const old_install_data = await this.installModel.findAll();
    if (old_install_data.length > 0) {
      for (const element of old_install_data) {
        await element.destroy().then(() => console.log('element destroyed'));
      }
    }

    const object = await this.installModel
      .create({
        event: body.event,
        event_handler_id: body.event_handler_id,
        data_VERSION: body.data.VERSION,
        data_ACTIVE: body.data.ACTIVE,
        data_INSTALLED: body.data.INSTALLED,
        data_LANGUAGE_ID: body.data.LANGUAGE_ID,
        ts: body.ts,
        auth_access_token: body.auth.access_token,
        auth_expires: body.auth.expires,
        auth_expires_in: body.auth.expires_in,
        auth_scope: body.auth.scope,
        auth_domain: body.auth.domain,
        auth_server_endpoint: body.auth.server_endpoint,
        auth_status: body.auth.status,
        auth_client_endpoint: body.auth.client_endpoint,
        auth_member_id: body.auth.member_id,
        auth_user_id: body.auth.user_id,
        auth_refresh_token: body.auth.refresh_token,
        auth_application_token: body.auth.application_token,
      })
      .then(async (new_auth) => {
        console.log('new auth created'.green, 'new auth created ', new_auth);
        install_return_example.BITRIX.TOKEN = new_auth.auth_access_token;
        install_return_example.BITRIX.CLIENT_SECRET =
          process.env['CLIENT_SECRET'];
        install_return_example.BITRIX.CLIENT_ID = process.env['CLIENT_ID'];
        install_return_example.TELEGRAM.TOKEN = process.env['BOT_TOKEN'];
        const register_connector_payload = {
          ID: install_return_example.BITRIX.CONNECTOR_ID,
          NAME: install_return_example.BITRIX.CONNECTOR_ID,
          ICON: {
            DATA_IMAGE: `data:image/svg+xml;charset=US-ASCII,${icon}`,
            COLOR: '#32a852',
            SIZE: '60%',
            POSITION: 'center',
          },
          ICON_DISABLED: {
            DATA_IMAGE: `data:image/svg+xml;charset=US-ASCII,${icon}`,
            COLOR: '#a84632',
            SIZE: '60%',
            POSITION: 'center',
          },
          PLACEMENT_HANDLER: install_return_example.BITRIX.PLACEMENT_HANDLER,
          DEL_EXTERNAL_MESSAGES: false,
          EDIT_INTERNAL_MESSAGES: false,
          DEL_INTERNAL_MESSAGES: false,
          NEWSLETTER: false,
          NEED_SYSTEM_MESSAGES: false,
          CHAT_GROUP: false,
        };
        await this.reinit_token().then(() => {});
        try {
          await lastValueFrom(
            this.httpService.post(
              `${this.bitrixWebhook}imconnector.register?auth=${this.access_token}`,
              register_connector_payload,
            ),
          );
        } catch (error) {
          console.log('lastValueFrom error'.red, error);
          throw Error(error);
        }
        //регистрация ивентов
        const events = install_return_example.BITRIX.EVENTS;
        const registred_events = await this.events_get();

        for (const event of events) {
          try {
            //check event
            const mapped_collection = registred_events.map((x) => x.event);
            const uppercased = event.name.toUpperCase();
            const is_uncludes = mapped_collection.includes(uppercased);
            if (is_uncludes) {
              console.log('Event already exists');
            } else {
              const event_registration = await lastValueFrom(
                this.httpService.post(
                  `${this.bitrixWebhook}event.bind?auth=${new_auth.auth_access_token}`,
                  {
                    event: event.name,
                    handler: event.handler,
                  },
                ),
              );
              console.log('event registred = '.yellow, event_registration);
            }
          } catch (error) {
            console.log(`registration event name: "${event.name}"`.red, error);
            throw Error(error);
          }
        }
        //returned value from promies (same thing)
        return install_return_example;
      });
    //i am returning this value to request (same thing)
    this.reinit_token();
    return object;
  }

  @Post('imopenlines_dialog_get')
  async imopenlines_dialog_get() {
    const endpoint = `${this.bitrixWebhook}/imopenlines.dialog.get`;
    const url = `${endpoint}?auth=${this.access_token}`;
    const data = {
      USER_CODE: 4018,
    };
    try {
      const request = await lastValueFrom(this.httpService.post(url, data));
      return request.data;
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  @Post('refresh_tokens')
  async refresh_tokens() {
    console.log('REFRESHING TOKENS'.yellow);
    const installModel = await this.installModel.findOne();
    if (installModel) {
      console.log(
        'OLD TOKEN ====> '.red,
        `${installModel.auth_access_token}`.bgRed,
      );
      const grant_type = 'refresh_token';
      const client_id = process.env['CLIENT_ID'];
      const client_secret = process.env['CLIENT_SECRET'];
      const refresh_token = installModel.auth_refresh_token;
      try {
        const request = await lastValueFrom(
          this.httpService.post(
            `https://chat.nbkfinance.ru/oauth/token/?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}`,
          ),
        );
        if (request.data.error) {
          throw Error(request.data.error);
        } else {
          const new_access_token = request.data['access_token'];
          const new_refresh_token = request.data['refresh_token'];
          await installModel
            .update({
              auth_access_token: new_access_token,
              auth_refresh_token: new_refresh_token,
            })
            .then((result) => {
              console.log(
                'UPDATED\nNEW TOKEN ====> '.green,
                `${result.auth_access_token}`.bgGreen,
              );
            });
          this.reinit_token();
        }
      } catch (error) {
        throw Error(error);
      }
    } else {
      console.log(
        '===============================================\nNo initial token found. Please reinstall applictaion inside of your bitrix\n===============================================\n'
          .yellow,
      );
    }
  }

  @Post('events_get')
  async events_get() {
    try {
      const request = await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}event.get?auth=${this.access_token}`,
        ),
      );
      return request.data.result;
    } catch (error) {
      console.log('error'.red, error);
      throw Error();
    }
  }

  @Post('event_bind')
  async event_bind(
    @Query('event') event: string,
    @Query('handler') handler: string,
  ) {
    try {
      const event_registration = await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}event.bind?auth=${this.access_token}`,
          {
            event,
            handler,
          },
        ),
      );
      return event_registration.data;
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  }

  @Post('event_unbind')
  async event_unbind(
    @Query('event') event: string,
    @Query('handler') handler: string,
  ) {
    try {
      const payload = {
        event,
        handler,
        auth: this.access_token,
      };
      const request = await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}event.unbind?auth=${this.access_token}`,
          payload,
        ),
      );
      return request.data;
    } catch (error) {
      console.log(error);
    }
  }

  @Post('placement_handler')
  async placement_handler(@Body() body: any) {
    console.log('PLACEMENT HANDLER TOUCHED'.yellow);
    const { PLACEMENT, PLACEMENT_OPTIONS } = body;
    if (PLACEMENT === 'SETTING_CONNECTOR' && PLACEMENT_OPTIONS) {
      try {
        const options = JSON.parse(PLACEMENT_OPTIONS);
        const LINE = parseInt(options.LINE, 10);
        const ACTIVE = options.ACTIVE_STATUS ? 1 : 0;

        // Вызов сервиса для обработки данных
        const create_line = await this.create_line({
          ACTIVE,
          CONNECTOR: 'openlinechatbot',
          LINE,
        });
        return create_line;
      } catch (error) {
        console.error(error);
        return 'Ошибка: некорректные данные';
      }
    }
    return 'Ошибка: неверный PLACEMENT или отсутствуют PLACEMENT_OPTIONS';
  }

  @Post('imconnector_connector_data_set')
  async imconnector_connector_data_set(
    @Body()
    { CONNECTOR, LINE, DATA }: ImConnectorClass,
  ) {
    const payload = {
      CONNECTOR,
      LINE,
      DATA,
    };
    payload.DATA = {
      id: '',
      url_im: install_return_example.BITRIX.WIDGET_URI,
      name: install_return_example.BITRIX.WIDGET_NAME,
    };
    const call = this.instance_call('imconnector.connector.data.set', payload);
    return call;
  }

  async create_line({ ACTIVE, CONNECTOR, LINE }: ImConnectorClass) {
    const request = await this.imconnector_activate({
      ACTIVE,
      CONNECTOR,
      LINE,
    });
    return request;
  }

  @Post('on_message_add')
  async on_message_add(@Body() body: any) {
    const messages = body.data.MESSAGES;
    for (const message of messages) {
      console.log('Message: '.yellow, message);
      const chat_id = message.chat.id;
      const text = formatText(message.message.text);
      const files = message.message.files;
      if (text.length > 0) {
        await this.bot.telegram
          .sendMessage(chat_id, text, {
            parse_mode: 'MarkdownV2',
          })
          .then(async (res) => {
            console.log('result after sending a message: ', res);
            await this.send_status_delivery(message);
          });
      }
      if (files) {
        for (const file of files) {
          const mime = file.mime;
          const link = file.link;
          switch (mime) {
            case 'image/png': {
              await this.bot.telegram
                .sendPhoto(chat_id, {
                  url: link,
                })
                .then(async () => await this.send_status_delivery(message));
            }
            default: {
              await this.bot.telegram
                .sendDocument(chat_id, {
                  filename: file.name,
                  url: file.link,
                })
                .then(async () => this.send_status_delivery(message));
            }
          }
        }
      }
    }
  }

  async send_status_delivery(MESSAGE) {
    const payload = {
      CONNECTOR: this.connector,
      LINE: this.open_line_id,
      MESSAGES: [MESSAGE],
    };
    try {
      await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}imconnector.send.status.delivery?auth=${this.access_token}`,
          payload,
        ),
      );
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  }

  @Post('on_status_delete')
  async on_status_delete() {
    console.log('ON STATUS DELETE');
  }

  @Post('imopenlines_config_list_get')
  async imopenlines_config_list_get() {
    try {
      const request = await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}imopenlines.config.list.get?auth=${this.access_token}`,
        ),
      );
      return request.data;
    } catch (error) {
      console.log(error);
    }
  }

  @Post('imopenlines_config_get')
  async imopenlines_config_get(@Query('line_id') line_id: number) {
    const payload = {
      CONFIG_ID: line_id,
    };
    try {
      const request = await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}imopenlines.config.get?auth=${this.access_token}`,
          payload,
        ),
      );
      return request.data;
    } catch (error) {
      console.log(error);
    }
  }

  @Post('imconnector_activate')
  async imconnector_activate(@Body() body?: ImConnectorClass) {
    const { LINE, CONNECTOR, ACTIVE } = body;
    const payload = {
      LINE,
      CONNECTOR,
      ACTIVE,
    };
    try {
      const request = await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}imconnector.activate?auth=${this.access_token}`,
          payload,
        ),
      );
      return request.data;
    } catch (error) {
      console.log(error);
      throw Error('imconnector_activate ERROR'.red);
    }
  }

  @Post('imconnector_status')
  async imconnector_status() {
    const payload = {
      CONNECTOR: 'openlinechatbot',
    };
    try {
      const request = await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}imconnector.status?auth=${this.access_token}`,
          payload,
        ),
      );
      return request.data;
    } catch (error) {
      console.log(error);
    }
  }

  @Post('imconnector_list')
  async imconnector_list() {
    try {
      const request = await lastValueFrom(
        this.httpService.post(
          `${this.bitrixWebhook}imconnector.list?auth=${this.access_token}`,
        ),
      );
      return request.data;
    } catch (error) {
      console.log(error);
    }
  }
}
