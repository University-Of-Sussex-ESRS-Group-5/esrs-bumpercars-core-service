import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '@config/types';
import { HttpService } from '@nestjs/axios';
import { JWTUtils } from '../jwt-utils';
import { JwtConfig } from '@config/types/jwt';
import { ApiError } from '../../common/classes/api-error';
import { ErrorCode } from '../../common/constants/errors';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name);

  constructor(
    private readonly configService: ConfigService<Config, true>,
    private readonly httpService: HttpService,
  ) {}

  get jwt() {
    const jwt = this.configService.get<JwtConfig>('jwt');

    return {
      secret: jwt.secret,
      expireTime: jwt.expireTime,
    };
  }

  async signToken(payload: ITokenPayload) {
    try {
      return await JWTUtils.signAsync(payload, this.jwt.secret, {
        expiresIn: this.jwt.expireTime,
      });
    } catch (error) {
      throw ApiError.error(ErrorCode.INVALID_TOKEN);
    }
  }

  async verifyToken(token: string) {
    try {
      return await JWTUtils.verifyAsync(token, this.jwt.secret);
    } catch (error) {
      throw ApiError.error(ErrorCode.INVALID_TOKEN);
    }
  }
}

interface ITokenPayload {
  userId: string;
}
