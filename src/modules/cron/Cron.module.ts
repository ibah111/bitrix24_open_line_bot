import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './Cron.service';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Users } from '../database/sqlite.database/models/User.model';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SequelizeModule.forFeature([Users], 'sqlite'),
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
