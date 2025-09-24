import {
  InferAttributes,
  InferCreationAttributes,
  type CreationOptional,
} from 'sequelize';
import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

@Table({ tableName: 'refresh_tokens', timestamps: false })
export class RefreshTokens extends Model<
  InferAttributes<RefreshTokens>,
  InferCreationAttributes<RefreshTokens>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  declare userId: number;

  @Column({ type: DataType.STRING(1024), unique: true, allowNull: false })
  declare refreshToken: string;
}
