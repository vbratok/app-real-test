import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import TokenPayload from './tokenPayload.interface';
import MongoError from '../utils/mongoError.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async signup(signupData: SignUpDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(signupData.password, salt);
    try {
      const createdUser = await this.usersService.create({
        ...signupData,
        password: hash,
      });
      return createdUser;
    } catch (error) {
      if (error?.code === MongoError.DuplicateKey) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(signinData: SignInDto): Promise<User> {
    const foundUser = await this.usersService.findByEmail(signinData.email);
    if (foundUser) {
      const { password } = foundUser;
      const matching = await bcrypt.compare(signinData.password, password);
      if (matching) {
        return foundUser;
      }
    }
    return null;
  }

  login(user: User): { user: User; access_token: string } {
    const payload: TokenPayload = {
      username: user.name,
      sub: user._id,
    };
    const { password, ...clearedUser } = JSON.parse(JSON.stringify(user));
    return {
      user: clearedUser,
      access_token: this.jwtService.sign(payload),
    };
  }
}
