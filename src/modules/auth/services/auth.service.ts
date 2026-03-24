import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(user: any) {
    return { access_token: 'fake-jwt-token' };
  }
}
