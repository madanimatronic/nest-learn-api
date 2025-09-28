export class BanUserDto {
  readonly userId: number;
  readonly banReason: string;

  constructor(data: BanUserDto) {
    this.userId = data.userId;
    this.banReason = data.banReason;
  }
}
