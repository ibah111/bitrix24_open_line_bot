import { BankRequisits } from '@contact/models';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Action, Ctx, Hears, Wizard, WizardStep } from 'nestjs-telegraf';
import { MENU_SCENE_ID, WEBHOOK_OPERATOR_WIZARD } from 'src/app.constants';
import { ExtendWizard } from 'src/utils/ExtendWizard';
import { Markup } from 'telegraf';
import { WizardContext } from 'telegraf/typings/scenes';

@Wizard(MENU_SCENE_ID)
export default class MenuWizard extends ExtendWizard {
  constructor(
    @InjectModel(BankRequisits, 'contact')
    private readonly modelBankRequisites: typeof BankRequisits,
  ) {
    super();
  }

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

  message_id: number;
  async deleteMessage(@Ctx() ctx: WizardContext) {
    ctx.deleteMessage(this.message_id);
  }

  @Hears('Оплата')
  async paymentHears(@Ctx() ctx: WizardContext) {
    ctx
      .replyWithMarkdown(
        'Каким методом вам будет провести оплату?',
        Markup.inlineKeyboard([
          [
            Markup.button.callback('Реквизиты', 'requisites'),
            Markup.button.callback('QR код', 'qrcode'),
            Markup.button.callback('Интернет-эквайринг', 'internetAcquiring'),
            Markup.button.callback('СБП', 'fastPaymentSystem'),
          ],
        ]),
      )
      .then((res) => {
        console.log(res);
        res.message_id = this.message_id;
      });
  }

  @Action('requisites')
  async requisitesAction(@Ctx() ctx: WizardContext) {
    const requisites = await this.modelBankRequisites.findOne({
      where: {
        id: 8,
      },
    });
    const ogrn = requisites.pay_purpose;
    const inn = requisites.inn;
    const kpp = requisites.kpp;
    const r_account = requisites.r_account;
    const k_account = requisites.k_account;
    const bik = requisites.bik;
    const recepient = requisites.br_name;
    const reply = `ОГРН:${ogrn}\nИНН:${inn}\nКПП:${kpp}\nР/счёт:${r_account}\nК/счёт:${k_account}\nБИК:${bik}\nПолучатель:${recepient}`;
    ctx.reply(reply);
    await this.deleteMessage(ctx);
  }
  @Action('qrcode')
  async qrcodeAction(@Ctx() ctx: WizardContext) {
    ctx.reply('qrcode');
    await this.deleteMessage(ctx);
  }
  @Action('internetAcquiring')
  async internetAcquiringAction(@Ctx() ctx: WizardContext) {
    ctx.reply('internetAcquiring');
    await this.deleteMessage(ctx);
  }
  @Action('fastPaymentSystem')
  async fastPaymentSystemAction(@Ctx() ctx: WizardContext) {
    ctx.reply('fastPaymentSystem');
    await this.deleteMessage(ctx);
  }
  /** */

  @Hears('Сайт')
  async siteHears(@Ctx() ctx: WizardContext) {
    ctx.reply('Ссылка на сайт кампании: https://pkonbk.ru/');
  }
  @Hears('Оператор')
  async operatorHears(@Ctx() ctx: WizardContext) {
    await this.leave(ctx).then(() => ctx.scene.enter(WEBHOOK_OPERATOR_WIZARD));
    const reply = `Открыт диалог с корпоративной открытой линией. 
      \nЕсли вы хотите связаться напрямую с сотрудником, позвоните по номеру 8-(800) 222-04-01`;
    ctx.reply(reply);
    ctx.scene.reenter();
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
