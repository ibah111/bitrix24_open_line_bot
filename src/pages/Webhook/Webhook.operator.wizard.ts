import { Ctx, Hears, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  fileUrl,
  MENU_SCENE_ID,
  WEBHOOK_OPERATOR_WIZARD,
} from 'src/app.constants';
import { ExtendWizard } from 'src/utils/ExtendWizard';
import { Context, Markup, NarrowedContext } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';
import { WizardContext } from 'telegraf/typings/scenes';
import WebhookService from './Webhook.service';
import { Picture } from './BitrixTypes';

@Wizard(WEBHOOK_OPERATOR_WIZARD)
export default class WebhookOperatorWizard extends ExtendWizard {
  constructor(private readonly webhookService: WebhookService) {
    super();
  }

  @WizardStep(1)
  protected onSceneEnter(@Ctx() ctx: WizardContext) {
    ctx.reply(
      'Ваше обращение передано в открытую линию. Вам ответит первый освободившийся оператор.',
    );
  }

  @On('text')
  protected async onText(
    @Ctx()
    ctx: NarrowedContext<
      WizardContext,
      Update.MessageUpdate<Message.TextMessage>
    >,
  ) {
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
        let picture: Picture;
        if (avatars.total_count > 0) {
          const photo = avatars.photos[0][0];
          const photo_id = photo.file_id;
          const file_link = await ctx.telegram.getFileLink(photo_id);
          picture = {
            url: file_link.href,
          };
        }
        const user = {
          id: ctx.from.id,
          name: `${ctx.from.first_name} ${ctx.from.last_name}`,
          picture,
        };

        await this.webhookService.sendToBitrix(user, message, chat);
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
  }

  @On('photo')
  protected async onPhoto(
    @Ctx()
    ctx: NarrowedContext<
      WizardContext,
      Update.MessageUpdate<Message.PhotoMessage>
    >,
  ) {
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
    await this.webhookService.sendToBitrix(user, message, chat);
  }

  @On('document')
  async onDocument(
    @Ctx()
    ctx: NarrowedContext<
      WizardContext,
      Update.MessageUpdate<Message.DocumentMessage>
    >,
  ) {
    const document = ctx.message.document;
    const file_id = document.file_id;
    const getLink = await ctx.telegram.getFileLink(file_id);
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
    await this.webhookService.sendToBitrix(user, message, chat);
  }

  @Hears('Оплата')
  async paymentHears(@Ctx() ctx: WizardContext) {
    ctx.replyWithMarkdown(
      'Каким методом вам будет провести оплату?',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('Реквизиты', 'requisites'),
          Markup.button.callback('QR код', 'qrcode'),
          Markup.button.callback('Интернет-эквайринг', 'internetAcquiring'),
          Markup.button.callback('СБП', 'fastPaymentSystem'),
        ],
      ]),
    );
  }

  @Hears('Сайт')
  async siteHears(@Ctx() ctx: WizardContext) {
    ctx.reply('Ссылка на сайт кампании: https://pkonbk.ru/');
  }
  @Hears('Оператор')
  async operatorHears(@Ctx() ctx: WizardContext) {
    await this.leave(ctx).then(() => ctx.scene.enter(WEBHOOK_OPERATOR_WIZARD));
    ctx.reply('Перенаправляю вас на оператора');
  }
  @Hears('Юр.информация')
  async requisitesHears(@Ctx() ctx: WizardContext) {
    ctx.sendDocument(fileUrl);
    ctx.scene.leave();
    ctx.reply('Возвращаю в меню.').then(() => ctx.scene.enter(MENU_SCENE_ID));
  }
}
