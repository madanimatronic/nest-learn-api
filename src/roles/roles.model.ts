import { ApiProperty } from '@nestjs/swagger';
import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserRoles } from 'src/users/models/user-roles.model';
import { User } from 'src/users/models/user.model';

// TODO: добавить seeding со стандартными ролями
@Table({ tableName: 'roles', timestamps: false })
export class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  @ApiProperty({
    description: 'Уникальный числовой id',
    example: '1',
  })
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ApiProperty({
    description: 'Название роли',
    example: 'ADMIN',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare name: string;

  @ApiProperty({
    description: 'Описание роли',
    example: 'Администратор. Может забанить',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  declare description: string;

  @BelongsToMany(() => User, () => UserRoles)
  declare users: CreationOptional<User[]>;
}
