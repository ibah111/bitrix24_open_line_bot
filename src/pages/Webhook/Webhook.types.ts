import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfigListGet {
  result: OpenLineClass[];
  time: TimeClass;
}
export class OpenLineClass {
  @IsString()
  @ApiPropertyOptional()
  ID: string;

  @IsString()
  @ApiPropertyOptional()
  ACTIVE: string;

  @IsString()
  @ApiPropertyOptional()
  LINE_NAME: string;

  @IsString()
  @ApiPropertyOptional()
  CRM: string;

  @IsString()
  @ApiPropertyOptional()
  CRM_CREATE: string;

  @IsString()
  @ApiPropertyOptional()
  CRM_CREATE_SECOND: string;

  @IsString()
  @ApiPropertyOptional()
  CRM_CREATE_THIRD: string;

  @IsString()
  @ApiPropertyOptional()
  CRM_FORWARD: string;

  @IsString()
  @ApiPropertyOptional()
  CRM_CHAT_TRACKER: string;

  @IsString()
  @ApiPropertyOptional()
  CRM_TRANSFER_CHANGE: string;

  @IsString()
  @ApiPropertyOptional()
  CRM_SOURCE: string;

  @IsString()
  @ApiPropertyOptional()
  QUEUE_TIME: string;

  @IsString()
  @ApiPropertyOptional()
  NO_ANSWER_TIME: string;

  @IsString()
  @ApiPropertyOptional()
  QUEUE_TYPE: string;

  @IsString()
  @ApiPropertyOptional()
  CHECK_AVAILABLE: string;

  @IsString()
  @ApiPropertyOptional()
  WATCH_TYPING: string;

  @IsString()
  @ApiPropertyOptional()
  WELCOME_BOT_ENABLE: string;

  @IsString()
  @ApiPropertyOptional()
  WELCOME_MESSAGE: string;

  @IsString()
  @ApiPropertyOptional()
  WELCOME_MESSAGE_TEXT: string;

  @IsString()
  @ApiPropertyOptional()
  VOTE_MESSAGE: string;

  @IsString()
  @ApiPropertyOptional()
  VOTE_TIME_LIMIT: string;

  @IsString()
  @ApiPropertyOptional()
  VOTE_BEFORE_FINISH: string;

  @IsString()
  @ApiPropertyOptional()
  VOTE_CLOSING_DELAY: string;

  @IsString()
  @ApiPropertyOptional()
  VOTE_MESSAGE_1_TEXT: string;

  @IsString()
  @ApiPropertyOptional()
  VOTE_MESSAGE_1_LIKE: string;

  @IsString()
  @ApiPropertyOptional()
  VOTE_MESSAGE_1_DISLIKE: string;

  @IsString()
  @ApiPropertyOptional()
  VOTE_MESSAGE_2_TEXT: string;

  @IsString()
  @ApiPropertyOptional()
  VOTE_MESSAGE_2_LIKE: string;

  @IsString()
  @ApiPropertyOptional()
  VOTE_MESSAGE_2_DISLIKE: string;

  @IsString()
  @ApiPropertyOptional()
  AGREEMENT_MESSAGE: string;

  @IsString()
  @ApiPropertyOptional()
  AGREEMENT_ID: string;

  @IsString()
  @ApiPropertyOptional()
  CATEGORY_ENABLE: string;

  @IsString()
  @ApiPropertyOptional()
  CATEGORY_ID: string;

  @IsString()
  @ApiPropertyOptional()
  WELCOME_BOT_JOIN: string;

  @IsString()
  @ApiPropertyOptional()
  WELCOME_BOT_ID: string;

  @IsString()
  @ApiPropertyOptional()
  WELCOME_BOT_TIME: string;

  @IsString()
  @ApiPropertyOptional()
  WELCOME_BOT_LEFT: string;

  @IsString()
  @ApiPropertyOptional()
  NO_ANSWER_RULE: string;

  @IsString()
  @ApiPropertyOptional()
  NO_ANSWER_FORM_ID: string;

  @IsString()
  @ApiPropertyOptional()
  NO_ANSWER_BOT_ID: string;

  @IsString()
  @ApiPropertyOptional()
  NO_ANSWER_TEXT: string;

  @IsString()
  @ApiPropertyOptional()
  WORKTIME_ENABLE: string;

  @IsString()
  @ApiPropertyOptional()
  WORKTIME_FROM: string;

  @IsString()
  @ApiPropertyOptional()
  WORKTIME_TO: string;

  @IsString()
  @ApiPropertyOptional()
  WORKTIME_TIMEZONE: string;

  @IsString()
  @ApiPropertyOptional()
  WORKTIME_HOLIDAYS: string;

  @IsString()
  @ApiPropertyOptional()
  WORKTIME_DAYOFF: string;

  @IsString()
  @ApiPropertyOptional()
  WORKTIME_DAYOFF_RULE: string;

  @IsString()
  @ApiPropertyOptional()
  WORKTIME_DAYOFF_FORM_ID: string;

  @IsString()
  @ApiPropertyOptional()
  WORKTIME_DAYOFF_BOT_ID: string;

  @IsString()
  @ApiPropertyOptional()
  WORKTIME_DAYOFF_TEXT: string;

  @IsString()
  @ApiPropertyOptional()
  CLOSE_RULE: string;

  @IsString()
  @ApiPropertyOptional()
  CLOSE_FORM_ID: string;

  @IsString()
  @ApiPropertyOptional()
  CLOSE_BOT_ID: string;

  @IsString()
  @ApiPropertyOptional()
  CLOSE_TEXT: string;

  @IsString()
  @ApiPropertyOptional()
  FULL_CLOSE_TIME: string;

  @IsString()
  @ApiPropertyOptional()
  AUTO_CLOSE_RULE: string;

  @IsString()
  @ApiPropertyOptional()
  AUTO_CLOSE_FORM_ID: string;

  @IsString()
  @ApiPropertyOptional()
  AUTO_CLOSE_BOT_ID: string;

  @IsString()
  @ApiPropertyOptional()
  AUTO_CLOSE_TIME: string;

  @IsString()
  @ApiPropertyOptional()
  AUTO_CLOSE_TEXT: string;

  @IsString()
  @ApiPropertyOptional()
  AUTO_EXPIRE_TIME: string;

  @IsString()
  @ApiPropertyOptional()
  DATE_CREATE: string;

  @IsString()
  @ApiPropertyOptional()
  DATE_MODIFY: string;

  @IsString()
  @ApiPropertyOptional()
  MODIFY_USER_ID: string;

  @IsString()
  @ApiPropertyOptional()
  TEMPORARY: string;

  @IsString()
  @ApiPropertyOptional()
  XML_ID: string;

  @IsString()
  @ApiPropertyOptional()
  LANGUAGE_ID: string;

  @IsString()
  @ApiPropertyOptional()
  QUICK_ANSWERS_IBLOCK_ID: string;

  @IsString()
  @ApiPropertyOptional()
  SESSION_PRIORITY: string;

  @IsString()
  @ApiPropertyOptional()
  TYPE_MAX_CHAT: string;

  @IsString()
  @ApiPropertyOptional()
  MAX_CHAT: string;

  @IsString()
  @ApiPropertyOptional()
  OPERATOR_DATA: string;

  @IsString()
  @ApiPropertyOptional()
  DEFAULT_OPERATOR_DATA: string;

  @IsString()
  @ApiPropertyOptional()
  KPI_FIRST_ANSWER_TIME: string;

  @IsString()
  @ApiPropertyOptional()
  KPI_FIRST_ANSWER_ALERT: string;

  @IsString()
  @ApiPropertyOptional()
  KPI_FIRST_ANSWER_LIST: string;

  @IsString()
  @ApiPropertyOptional()
  KPI_FIRST_ANSWER_TEXT: string;

  @IsString()
  @ApiPropertyOptional()
  KPI_FURTHER_ANSWER_TIME: string;

  @IsString()
  @ApiPropertyOptional()
  KPI_FURTHER_ANSWER_ALERT: string;

  @IsString()
  @ApiPropertyOptional()
  KPI_FURTHER_ANSWER_LIST: string;

  @IsString()
  @ApiPropertyOptional()
  KPI_FURTHER_ANSWER_TEXT: string;

  @IsString()
  @ApiPropertyOptional()
  KPI_CHECK_OPERATOR_ACTIVITY: string;

  @IsString()
  @ApiPropertyOptional()
  SEND_NOTIFICATION_EMPTY_QUEUE: string;

  @IsString()
  @ApiPropertyOptional()
  USE_WELCOME_FORM: string;

  @IsString()
  @ApiPropertyOptional()
  WELCOME_FORM_ID: string;

  @IsString()
  @ApiPropertyOptional()
  WELCOME_FORM_DELAY: string;

  @IsString()
  @ApiPropertyOptional()
  SEND_WELCOME_EACH_SESSION: string;

  @IsString()
  @ApiPropertyOptional()
  CONFIRM_CLOSE: string;

  @IsString()
  @ApiPropertyOptional()
  IGNORE_WELCOME_FORM_RESPONSIBLE: string;
}
export class TimeClass {
  start: number;
  finish: number;
  duration: number;
  processing: number;
  date_start: Date;
  date_finish: Date;
}

export class ImConnectorClass<T = object> {
  @ApiProperty({
    default: 29,
  })
  LINE: number;

  @ApiProperty({
    default: 'openlinechatbot',
  })
  CONNECTOR: string;

  @ApiProperty({
    default: 1,
  })
  ACTIVE: number;

  @ApiPropertyOptional({
    default: {} as T,
  })
  DATA?: any;
}
