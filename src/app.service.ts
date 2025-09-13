import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getInfo() {
    return { info: 'Learn api server', version: 'v0.1' };
  }
}
