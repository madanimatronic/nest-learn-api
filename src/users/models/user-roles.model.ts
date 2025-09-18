import { type CreationOptional } from 'sequelize';
import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Role } from 'src/roles/roles.model';
import { User } from 'src/users/models/user.model';

@Table({ tableName: 'user_roles', timestamps: false })
export class UserRoles extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column
  declare userId: number;

  @ForeignKey(() => Role)
  @Column
  declare roleId: number;
}
