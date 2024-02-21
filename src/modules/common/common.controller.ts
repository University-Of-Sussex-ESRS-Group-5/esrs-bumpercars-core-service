import { Controller } from '@nestjs/common';
import { CommonService } from './services/common.service';

@Controller('common')
export class CommonController {
  constructor(private readonly walletService: CommonService) {}
}
