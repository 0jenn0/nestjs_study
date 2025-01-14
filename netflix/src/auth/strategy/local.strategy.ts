import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

export class LocalAuthGuard extends AuthGuard('river') {}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'river') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    }); // 모든 Strategy는 항상 super()를 호출해야 함
  }

  /**
   * LocalStrategy
   *
   * validate: username, password
   *
   * return값을 Request에서 받을 수 있다.
   */
  async validate(email: string, password: string) {
    const user = await this.authService.authenticate(email, password);

    return user;
  }
}
