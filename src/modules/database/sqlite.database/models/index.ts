import { ModelCtor } from '@sql-tools/sequelize-typescript';
import { Roles } from './Role.model';
import { Users } from './User.model';
import { UsersRoles } from './UserRole.model';
import InstallModel from './Install.model';

export const models: ModelCtor[] = [Users, Roles, UsersRoles, InstallModel];
