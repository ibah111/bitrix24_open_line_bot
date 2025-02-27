import { IsNumber, IsString } from 'class-validator';
import { CreationAttributes } from '@sql-tools/sequelize';
import { Users } from 'src/modules/database/sqlite.database/models/User.model';

export class UserCreateInput implements CreationAttributes<Users> {
  @IsNumber()
  id_telegram: number;
  @IsString()
  username: string;
}
