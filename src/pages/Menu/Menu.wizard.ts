import { Action, Ctx, Hears, Wizard, WizardStep } from 'nestjs-telegraf';
import { MENU_SCENE_ID } from 'src/app.constants';
import { Markup } from 'telegraf';
import { WizardContext } from 'telegraf/typings/scenes';

@Wizard(MENU_SCENE_ID)
export default class MenuWizard {
  constructor() {}

  @WizardStep(1)
  async menu(@Ctx() ctx: WizardContext) {
    //удалил строку @deprecated из пакета
    ctx.replyWithMarkdown(
      'Выберите опцию.',
      Markup.keyboard([
        [Markup.button.callback('Оплата', 'payment')],
        [Markup.button.callback('Сайт', 'site')],
        [Markup.button.callback('Оператор', 'operator')],
        [Markup.button.callback('Юр.информация', 'law_info')],
      ])
        .resize()
        .oneTime(),
    );
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
  /** */
  @Action('requisites')
  async requisitesAction() {}

  @Action('qrcode')
  async qrcodeAction() {}

  @Action('internetAcquiring')
  async internetAcquiringAction() {}

  @Action('fastPaymentSystem')
  async fastPaymentSystemAction() {}

  /** */

  @Hears('Сайт')
  async siteHears(@Ctx() ctx: WizardContext) {
    ctx.reply('Ссылка на сайт кампании: https://pkonbk.ru/');
  }
  @Hears('Оператор')
  async operatorHears(@Ctx() ctx: WizardContext) {
    ctx.reply('Реквизиты!');
    /**
     * Вход в диалоговое окно с контакнт центром
     */
  }
  @Hears('Юр.информация')
  async requisitesHears(@Ctx() ctx: WizardContext) {
    const fileUrl =
      'https://pkonbk.ru/wp-content/uploads/2024/01/%D0%9F%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0-%D0%BE%D0%B1-%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B5-%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D1%85-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85.pdf';
    ctx.sendDocument(fileUrl);
    ctx.scene.leave();
    ctx.reply('Возвращаю в меню.').then(() => this.menu(ctx));
  }
}
