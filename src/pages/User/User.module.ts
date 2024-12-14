import { Module } from '@nestjs/common';
import { UserWizard } from './User.wizard';
import { UserUpdate } from './User.update';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { Person } from '@contact/models';
import { Users } from 'src/modules/database/sqlite.database/models/User.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Person], 'contact'),
    SequelizeModule.forFeature([Users], 'sqlite'),
  ],
  providers: [UserWizard, UserUpdate],
})
export class UserModule {}
