import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { MENU_SCENE_ID, START_SCENE_ID } from 'src/app.constants';
import { Users } from 'src/modules/database/sqlite.database/models/User.model';
import { WizardContext } from 'telegraf/typings/scenes';

@Wizard(START_SCENE_ID)
export class UserWizard {
  constructor(
    @InjectModel(Users, 'sqlite') private readonly modelUser: typeof Users,
  ) {}

  sceneLeave(ctx: WizardContext) {
    ctx.scene.leave().then(() => ctx.reply('Покидаю сцену'));
  }

  async userdb(username: string) {
    return await this.modelUser.findOne({
      where: {
        username,
      },
    });
  }

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext) {
    console.log('Entering step 1\n'.yellow, 'User info: ', ctx.from);

    const user = await this.modelUser.findOne({
      where: {
        username: ctx.from.username,
      },
    });
    if (user) {
      const f = user.f;
      const i = user.i;
      const o = user.o;
      const contract = user.contract;
      const phone_number = user.phone_number;
      console.log('user', user.dataValues);
      if (!f || f === '') {
        ctx.reply('Фамилия не заполнена');
      }
      if (!i || i === '') {
        ctx.reply('Имя не заполнено');
      }
      if (!o || o === '') {
        ctx.reply('Отчество не заполнена');
      }
      if (!contract || contract === '') {
        ctx.reply('Кредитный договор не заполнен');
      }
      if (!phone_number || phone_number === '') {
        ctx.reply('Телефонный номер не заполнен');
      }
      ctx.reply('Пользователь уже создан');
      ctx.scene.leave().then(() => {
        ctx.reply('Сцена /start покинута.');
        ctx.scene.enter(MENU_SCENE_ID);
      });
    } else if (!user) {
      await this.modelUser.create({
        username: ctx.from.username,
        id_telegram: ctx.from.id,
      });
      ctx.reply(
        `Здравствуйте ${ctx.from.username}. Пользуясь данным ботом, вы соглашаетесь на обработку персональных данных. Приступаем к заполнению формы данных`,
      );
      ctx.wizard.next();
      return 'Введите фамилию.';
    }
  }

  @On('text')
  @WizardStep(2)
  async f(@Ctx() ctx: WizardContext, @Message() msg: { text: string }) {
    console.log('familiya step'.bgCyan);
    const user = await this.userdb(ctx.from.username);
    user
      .update({
        f: msg.text,
      })
      .then((res) => {
        console.log(`фамилия user'a "${ctx.from.username}" => ${res.f}`.yellow);
      });
    ctx.wizard.next();
    return 'Введите имя: ';
  }

  @On('text')
  @WizardStep(3)
  async i(@Ctx() ctx: WizardContext, @Message() msg: { text: string }) {
    console.log('imya step'.bgCyan);
    const user = await this.userdb(ctx.from.username);
    user
      .update({
        i: msg.text,
      })
      .then((res) => {
        console.log(`имя user'a "${ctx.from.username}" => ${res.f}`.yellow);
      });
    ctx.wizard.next();
    return 'Введите отчество: ';
  }

  @On('text')
  @WizardStep(4)
  async o(@Ctx() ctx: WizardContext, @Message() msg: { text: string }) {
    console.log('otchestvo step'.bgCyan);
    const user = await this.userdb(ctx.from.username);
    user
      .update({
        o: msg.text,
      })
      .then((res) => {
        console.log(
          `отчество user'a "${ctx.from.username}" => ${res.f}`.yellow,
        );
      });
    ctx.wizard.next();
    return 'Введите контракт: ';
  }

  @On('text')
  @WizardStep(5)
  async contract(@Ctx() ctx: WizardContext, @Message() msg: { text: string }) {
    console.log('contract step'.bgCyan);
    const user = await this.userdb(ctx.from.username);
    user
      .update({
        contract: msg.text,
      })
      .then((res) => {
        console.log(`КД user'a "${ctx.from.username}" => ${res.f}`.yellow);
      });
    ctx.wizard.next();
    return 'Введите телефонный номер: ';
  }

  @On('text')
  @WizardStep(6)
  async phone_number(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ) {
    console.log('phone_number step'.bgCyan);
    const user = await this.userdb(ctx.from.username);
    user
      .update({
        phone_number: msg.text,
      })
      .then((res) => {
        console.log(`имя user'a "${ctx.from.username}" => ${res.f}`.yellow);
      });
    ctx.reply('Форма заполнена');
    ctx.wizard.next();
    this.sceneLeave(ctx);
  }
}
