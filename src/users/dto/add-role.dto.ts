export class AddRoleToUserDto {
  readonly userId: number;
  readonly role: string;

  // Не идеальный тип для data, но годится, если использовать разумно
  constructor(data: AddRoleToUserDto) {
    this.userId = data.userId;
    this.role = data.role;
  }
}
