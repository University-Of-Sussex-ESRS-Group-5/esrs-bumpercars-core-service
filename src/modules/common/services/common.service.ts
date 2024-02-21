import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '@config/types';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name);

  constructor(
    private readonly configService: ConfigService<Config, true>,
    private readonly httpService: HttpService,
  ) {}
}
