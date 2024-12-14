import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) =>
  await context.sequelize.transaction((t) =>
    Promise.all([
      context.sequelize.models.Roles.bulkCreate(
        [
          { id: 1, name: 'admin', title: 'Админ' },
          { id: 2, name: 'user', title: 'Пользователь' },
        ],
        {
          transaction: t,
        },
      ),
    ]),
  );
