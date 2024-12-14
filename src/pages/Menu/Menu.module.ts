import { Module } from '@nestjs/common';
import MenuWizard from './Menu.wizard';

@Module({
  providers: [MenuWizard],
})
export default class MenuModule {}
