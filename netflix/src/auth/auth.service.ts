import { ConfigService } from '@nestjs/config';
import { Role, User } from '@/user/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { envVariablesKeys } from '@/common/const/env.const';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  parseBasicToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    const [basic, token] = basicSplit;

    if (basic.toLowerCase() !== 'basic') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');

    const tokenSplit = decodedToken.split(':');

    if (tokenSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    const [email, password] = tokenSplit;

    return { email, password };
  }

  async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    const [bearer, token] = basicSplit;

    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(
        envVariablesKeys.accessTokenSecret,
      ),
    });

    if (!isRefreshToken) {
      if (payload.type !== 'access') {
        throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
      }
    } else {
      if (payload.type !== 'refresh') {
        throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
      }
    }

    return payload;
  }

  // rawToken -> "Basic token"
  async register(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new BadRequestException('이미 가입한 이메일 주소입니다.');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.get<number>(envVariablesKeys.hashRounds),
    );

    await this.userRepository.save({ email, password: hashedPassword });

    return await this.userRepository.findOne({ where: { email } });
  }

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('잘못된 로그인 정보입니다.');
    }

    const passOk = await bcrypt.compare(password, user.password);

    if (!passOk) {
      throw new BadRequestException('잘못된 로그인 정보입니다.');
    }

    return user;
  }

  async issueToken(user: { id: number; role: Role }, isRefresh: boolean) {
    const refreshTokenSecret = this.configService.get<string>(
      envVariablesKeys.refreshTokenSecret,
    );
    const accessTokenSecret = this.configService.get<string>(
      envVariablesKeys.accessTokenSecret,
    );

    return await this.jwtService.signAsync(
      {
        sub: user.id,
        role: user.role,
        type: isRefresh ? 'refresh' : 'access',
      },
      {
        secret: isRefresh ? refreshTokenSecret : accessTokenSecret,
        expiresIn: isRefresh ? '24h' : 300,
      },
    );
  }

  async login(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);

    const user = await this.authenticate(email, password);

    return {
      refreshToken: await this.issueToken(
        { id: user.id, role: user.role },
        true,
      ),
      accessToken: await this.issueToken(
        { id: user.id, role: user.role },
        false,
      ),
    };
  }
}
