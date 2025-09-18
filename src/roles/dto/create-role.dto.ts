import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Название роли',
    example: 'ADMIN',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Описание роли',
    example: 'Администратор. Может забанить',
  })
  readonly description: string;
}
