import { QueryInterface, DataTypes } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction((t) =>
    Promise.all([
      context.createTable(
        'Install',
        {
          id: {
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          event: { type: DataTypes.STRING },
          event_handler_id: { type: DataTypes.STRING },
          data_VERSION: { type: DataTypes.STRING },
          data_ACTIVE: { type: DataTypes.STRING },
          data_INSTALLED: { type: DataTypes.STRING },
          data_LANGUAGE_ID: { type: DataTypes.STRING },
          ts: { type: DataTypes.STRING },
          auth_access_token: {
            type: DataTypes.STRING,
          },
          auth_expires: {
            type: DataTypes.STRING,
          },
          auth_expires_in: {
            type: DataTypes.STRING,
          },
          auth_scope: {
            type: DataTypes.STRING,
          },
          auth_domain: {
            type: DataTypes.STRING,
          },
          auth_server_endpoint: {
            type: DataTypes.STRING,
          },
          auth_status: {
            type: DataTypes.STRING,
          },
          auth_client_endpoint: {
            type: DataTypes.STRING,
          },
          auth_member_id: {
            type: DataTypes.STRING,
          },
          auth_user_id: {
            type: DataTypes.STRING,
          },
          auth_refresh_token: {
            type: DataTypes.STRING,
          },
          auth_application_token: {
            type: DataTypes.STRING,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
        },
        {
          transaction: t,
        },
      ),
    ]),
  );
