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
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from './user-roles.model';

// TODO: скорее всего лучше создать DTO ответа сервера,
// указать его как возвращаемый тип и документировать его, но возможно это избыточно
@Table({ tableName: 'users' })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
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
    description: 'Email',
    example: 'user-test@example.com',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'qwaszx123',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  // TODO: Лучше вынести в отдельную таблицу
  @ApiProperty({
    description: 'Забанен ли пользователь',
    example: 'false',
  })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare banned: CreationOptional<boolean>;

  @ApiProperty({
    description: 'Причина бана',
    example: 'banned for test',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  declare banReason: CreationOptional<string | null>;

  @ApiProperty({
    description: 'Дата создания',
    example: '2025-09-14T20:40:09.459Z',
  })
  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @ApiProperty({
    description: 'Дата обновления',
    example: '2025-09-14T20:40:09.459Z',
  })
  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @BelongsToMany(() => Role, () => UserRoles)
  declare roles: CreationOptional<Role[]>;
}
