import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { envVariablesKeys } from '@/common/const/env.const';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      next();
      return;
    }

    try {
      const token = this.validateBearerToken(authHeader);
      const tokenKey = `TOKEN_${token}`;

      const cachedPayload = await this.cacheManager.get(tokenKey);

      if (cachedPayload) {
        req.user = cachedPayload;

        return next();
      }

      const decodedPayload = this.jwtService.decode(token); // decode: 토큰을 디코딩하여 페이로드를 얻는다. 만료가됐는지 이런거 검증 안한다.

      if (
        decodedPayload.type !== 'refresh' &&
        decodedPayload.type !== 'access'
      ) {
        throw new UnauthorizedException('잘못된 토큰입니다.');
      }

      const secretKey =
        decodedPayload.type === 'refresh'
          ? envVariablesKeys.refreshTokenSecret
          : envVariablesKeys.accessTokenSecret;

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(secretKey),
      });

      // payload['exp'] -> epoch time seconds
      const expiryDate = +new Date(payload['exp'] * 1_000);
      const now = +Date.now();

      const differenceInSeconds = (expiryDate - now) / 1_000;

      await this.cacheManager.set(
        tokenKey,
        payload,
        Math.max((differenceInSeconds - 30) * 1_000, 1),
      );

      req.user = payload;
      next();
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('토큰이 만료됐습니다.');
      }

      next();
    }
  }

  validateBearerToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    const [bearer, token] = basicSplit;

    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    return token;
  }
}
