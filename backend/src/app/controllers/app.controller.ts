import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('root')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get API status' })
  getStatus(): { status: string; message: string } {
    return {
      status: 'ok',
      message: 'API is running',
    };
  }
}

