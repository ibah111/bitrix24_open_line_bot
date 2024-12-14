import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectModel } from '@sql-tools/nestjs-sequelize';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Users } from '../database/sqlite.database/models/User.model';

/**
 * @description По скольку я не знаю как работать с кроном
 * и как правильно ему указывать тайминги поэтмоу я оставлю себе подсказку
 * @hint =>
 * -----------
 * * * * * * *
 * | | | | | |
 * | | | | | day of week
 * | | | | months
 * | | | day of month
 * | | hours
 * | minutes
 */
@Injectable()
export class CronService {
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    @InjectModel(Users, 'sqlite') private readonly modelUsers: typeof Users,
    private readonly reg: SchedulerRegistry,
  ) {}
  private readonly logger = new Logger(CronService.name);

  @Cron(CronExpression.EVERY_10_MINUTES, { name: 'test_message' })
  async sendTestMessage() {
    const testMessage = 'Test message';
    const user = await this.modelUsers.findOne({
      where: {
        username: 'Nbahvc',
      },
    });
    // this.bot.telegram.sendMessage(user.dataValues.id_telegram, testMessage);
    const job = this.reg.getCronJob('test_message');
    // console.log(job.nextDates(1));
    // this.logger.debug(
    //   'Cron is launched. Data syncronize happes everyday at midnight',
    // );
  }
}
