import { Module } from '@nestjs/common';
import { WebhookController } from './Webhook.controller';
import WebhookService from './Webhook.service';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@sql-tools/nestjs-sequelize';
import InstallModel from 'src/modules/database/sqlite.database/models/Install.model';
import WebhookOperatorWizard from './Webhook.operator.wizard';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, WebhookOperatorWizard],
  imports: [HttpModule, SequelizeModule.forFeature([InstallModel], 'sqlite')],
})
export default class WebhookModule {}
