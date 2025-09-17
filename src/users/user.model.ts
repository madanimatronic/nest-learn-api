import { ApiProperty } from '@nestjs/swagger';
import { InferAttributes } from 'sequelize';
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface UserCreationAttributes {
  email: string;
  password: string;
}

// TODO: можно улучшить, задав аттрибуты создания через InferCreationAttributes<User> и CreationOptional<тип> для столбцов
@Table({ tableName: 'users' })
export class User extends Model<InferAttributes<User>, UserCreationAttributes> {
  // Проверить, нужен ли unique
  @ApiProperty({
    example: '1',
    description: 'Уникальный числовой id',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({
    example: 'user-test@example.com',
    description: 'Email',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;

  @ApiProperty({
    example: 'qwaszx123',
    description: 'Пароль',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  // TODO: Лучше вынести в отдельную таблицу
  @ApiProperty({
    example: 'false',
    description: 'Забанен ли пользователь',
  })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare banned: boolean;

  @ApiProperty({
    example: 'banned for test',
    description: 'Причина бана',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  declare banReason: string;

  @ApiProperty({
    example: '2025-09-14T20:40:09.459Z',
    description: 'Дата создания',
  })
  @CreatedAt
  declare createdAt: Date;

  @ApiProperty({
    example: '2025-09-14T20:40:09.459Z',
    description: 'Дата обновления',
  })
  @UpdatedAt
  declare updatedAt: Date;
}
