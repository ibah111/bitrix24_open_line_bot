import { Module } from '@nestjs/common';
import MenuWizard from './Menu.wizard';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import { BankRequisits } from '@contact/models';

@Module({
  imports: [SequelizeModule.forFeature([BankRequisits], 'contact')],
  providers: [MenuWizard],
})
export default class MenuModule {}
