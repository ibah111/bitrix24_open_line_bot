import { Module } from '@nestjs/common';
import SqliteDatabase from './sqlite.database';
import { ContactDatabase } from './contact.database';
import { SendDatabase } from './send.database/send.database';

@Module({
  imports: [SqliteDatabase, ContactDatabase, SendDatabase],
})
export default class DatabaseModule {}
