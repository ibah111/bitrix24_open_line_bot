import { Module } from '@nestjs/common';
import { models } from './models';
import { SqliteDatabaseSeed } from './seed';
import { Users } from './models/User.model';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      name: 'sqlite',
      dialect: 'sqlite',
      storage: 'database.sqlite',
      models,
    }),
    SequelizeModule.forFeature([Users], 'sqlite'),
  ],
  providers: [SqliteDatabaseSeed],
})
export default class SqliteDatabase {}
