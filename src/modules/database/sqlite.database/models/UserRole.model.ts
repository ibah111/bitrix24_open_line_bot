import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import { Roles } from './Role.model';
import { Users } from './User.model';
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from '@sql-tools/sequelize';
import { CreateLiteralAssociation } from '@sql-tools/association-literal';

@Table({ tableName: 'user', timestamps: false })
export class UsersRoles extends Model<
  InferAttributes<UsersRoles>,
  InferCreationAttributes<UsersRoles>,
  CreateLiteralAssociation<UsersRoles>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;
  @ForeignKey(() => Users)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  user_id: number;
  @BelongsTo(() => Users)
  User?: Users;
  @ForeignKey(() => Roles)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  role_id: number;
  @BelongsTo(() => Roles)
  Role?: Roles;
}
