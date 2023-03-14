import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    description:
      'Just a test root route responce to indicates that apis is up and running',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
