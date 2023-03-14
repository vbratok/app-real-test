import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import MongooseClassSerializerInterceptor from '../utils/mongooseClassSerializer.interceptor';
import { User } from '../users/entities/user.entity';
import RequestWithUser from './requestWithUser.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ description: 'Signs up new user white registration' })
  @Post('signup')
  async signup(@Body() user: SignUpDto) {
    return await this.authService.signup(user);
  }

  @ApiOperation({
    description:
      'Authenticates existing user by getting createntials and requring access_token and user details',
  })
  @ApiBody({ type: SignInDto })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    description: 'Checks the validity of access_token and returns user details',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  authenticate(@Req() req: RequestWithUser) {
    return req.user;
  }
}
