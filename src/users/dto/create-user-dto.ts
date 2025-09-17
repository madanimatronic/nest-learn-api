import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user-test@example.com',
    description: 'Email',
  })
  readonly email: string;

  @ApiProperty({
    example: 'qwaszx123',
    description: 'Пароль',
  })
  readonly password: string;
}
