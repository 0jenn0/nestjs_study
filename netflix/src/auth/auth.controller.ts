import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategy/local.strategy';
import { User } from '@/user/entities/user.entity';
import { JwtAuthGuard } from './strategy/jwt.strategy';
import { Public } from './decorator/public.decorator';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { Authorization } from './decorator/authorization.decorator';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiBasicAuth()
  // authorization: Basic token
  registerUser(@Authorization() token: string) {
    return this.authService.register(token);
  }

  @Public()
  @Post('login')
  @ApiBasicAuth()
  // authorization: refresh Token
  loginUser(@Authorization() token: string) {
    return this.authService.login(token);
  }

  @Post('token/block')
  blockToken(@Body('token') token: string) {
    return this.authService.tokenBlock(token);
  }

  @Post('token/access')
  async rotateAccess(@Headers('authorization') token: string) {
    const payload = await this.authService.parseBearerToken(token, true);

    return {
      accessToken: await this.authService.issueToken(payload, false),
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login/passport')
  async loginUserPassport(@Request() req: { user: User }) {
    const payload = {
      id: req.user.id,
      role: req.user.role,
    };

    return {
      refreshToken: await this.authService.issueToken(payload, true),
      accessToken: await this.authService.issueToken(payload, false),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('private')
  async private(@Request() req: { user: User }) {
    return req.user;
  }
}
