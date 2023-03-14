import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import RequestWithUser from './requestWithUser.interface';

const createUser: SignUpDto = {
  name: 'John Due',
  email: 'j.due@dummyserver.com',
  password: '123456789',
};

const userMock = {
  _id: '640f2997fb5c556ecd662c8f',
  name: 'John Due',
  email: 'j.due@dummyserver.com',
} as User;

const tokenMock = {
  user: userMock,
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI',
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn().mockResolvedValue(userMock),
            login: jest.fn().mockResolvedValue(tokenMock),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should signup a User', async () => {
      expect(controller.signup(createUser)).resolves.toEqual(userMock);
    });
  });

  describe('signin', () => {
    it('should signin a User', async () => {
      expect(
        controller.login({ user: userMock } as RequestWithUser),
      ).resolves.toEqual(tokenMock);
    });
  });

  describe('authenticate', () => {
    it('should authenticate a User', async () => {
      expect(
        controller.authenticate({ user: userMock } as RequestWithUser),
      ).toEqual(userMock);
    });
  });
});
