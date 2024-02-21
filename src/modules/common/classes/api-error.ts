import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiError extends HttpException {
  public data: any;
  public message: string;

  constructor(message: string, code?: number, data?: any) {
    super(message, code || HttpStatus.BAD_REQUEST);

    this.data = data;
    this.message = message;
  }

  static error(message: string, code?: number, data?: any) {
    throw new ApiError(message, code, data);
  }
}
