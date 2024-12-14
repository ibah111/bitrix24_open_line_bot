import { Module } from '@nestjs/common';
import { SendModels } from './server.models';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
@Module({
  imports: [
    SequelizeModule.forRoot({
      host: 'newct.usb.ru',
      dialect: 'mssql',
      name: 'send',
      username: 'contact',
      password: 'contact',
      database: 'Send',
      logging: false,
      models: SendModels,
    }),
  ],
})
export class SendDatabase {}
