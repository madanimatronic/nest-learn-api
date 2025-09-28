export class SetUserRolesDto {
  readonly userId: number;
  readonly roles: string[];

  constructor(data: SetUserRolesDto) {
    this.userId = data.userId;
    this.roles = data.roles;
  }
}
