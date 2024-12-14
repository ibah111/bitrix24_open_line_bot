import { Module } from '@nestjs/common';
import { UserModule } from './User/User.module';
import MenuModule from './Menu/Menu.module';
import WebhookModule from './Webhook/Webhook.module';

@Module({
  imports: [UserModule, MenuModule, WebhookModule],
})
export class PagesModule {}
