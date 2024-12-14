import {
  BelongsToManyAttribute,
  CreateLiteralAssociation,
} from '@sql-tools/association-literal';
import { InferAttributes, InferCreationAttributes } from '@sql-tools/sequelize';
import { CreationOptional } from '@sql-tools/sequelize';
import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from '@sql-tools/sequelize-typescript';
import { Length, ValidationArguments } from 'class-validator';
import { Roles } from './Role.model';
import { UsersRoles } from './UserRole.model';
import { NonAttribute } from 'sequelize';

@Table({ tableName: 'Users' })
export class Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>,
  CreateLiteralAssociation<Users>
> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: CreationOptional<number>;

  @Column(DataType.INTEGER)
  id_telegram: number;

  @Column(DataType.STRING)
  username: string;

  @Column(DataType.STRING)
  f: string;

  @Column(DataType.STRING)
  i: string;

  @Column(DataType.STRING)
  o: string;

  @Column(DataType.STRING)
  contract: string;

  @Length(11, 15, {
    message: (args: ValidationArguments) => {
      const value = args.value.length;
      if (value < 11) {
        return 'too short';
      } else if (value > 15) {
        return 'too long';
      }
    },
  })
  @Column(DataType.STRING)
  phone_number: string;

  @Column(DataType.INTEGER)
  r_person_id: number;

  @BelongsToMany(() => Roles, () => UsersRoles)
  Roles?: BelongsToManyAttribute<
    NonAttribute<Array<Roles & { UsersRoles?: UsersRoles }>>
  >;
}
