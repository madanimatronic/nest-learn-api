import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email',
    example: 'user-test@example.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'qwaszx123',
  })
  readonly password: string;
}
