import { InferAttributes, InferCreationAttributes } from '@sql-tools/sequelize';
import {
  AutoIncrement,
  Model,
  PrimaryKey,
} from '@sql-tools/sequelize-typescript';
import { Column, DataType, Table } from '@sql-tools/sequelize-typescript';

@Table({
  tableName: 'Install',
})
export default class InstallModel extends Model<
  InferAttributes<InstallModel>,
  InferCreationAttributes<InstallModel>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  event: string;

  @Column(DataType.STRING)
  event_handler_id: string;

  @Column(DataType.STRING)
  data_VERSION: string;

  @Column(DataType.STRING)
  data_ACTIVE: string;

  @Column(DataType.STRING)
  data_INSTALLED: string;

  @Column(DataType.STRING)
  data_LANGUAGE_ID: string;

  @Column(DataType.STRING)
  ts: string;

  //важно
  @Column(DataType.STRING)
  auth_access_token: string;

  @Column(DataType.STRING)
  auth_expires: string;

  @Column(DataType.STRING)
  auth_expires_in: string;

  @Column(DataType.STRING)
  auth_scope: string;

  @Column(DataType.STRING)
  auth_domain: string;

  @Column(DataType.STRING)
  auth_server_endpoint: string;

  @Column(DataType.STRING)
  auth_status: string;

  @Column(DataType.STRING)
  auth_client_endpoint: string;

  @Column(DataType.STRING)
  auth_member_id: string;

  //id пользователя в битриксе
  @Column(DataType.STRING)
  auth_user_id: string;

  @Column(DataType.STRING)
  auth_refresh_token: string;

  @Column(DataType.STRING)
  auth_application_token: string;
}
