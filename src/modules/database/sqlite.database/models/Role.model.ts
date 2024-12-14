import { CreationOptional, BelongsTo } from '@sql-tools/sequelize';
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from '@sql-tools/sequelize-typescript';
import { Users } from './User.model';
import { UsersRoles } from './UserRole.model';

@Table({ tableName: 'Roles', timestamps: false })
export class Roles extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @BelongsToMany(() => Users, () => UsersRoles)
  Users?: BelongsTo<Users, UsersRoles>;
}
