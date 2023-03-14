import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import MongoError from '../utils/mongoError.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';

const signupDto = {
  name: 'John Due',
  email: 'j.due@superemailservice.com',
  password: '1234567',
} as SignUpDto;

const mock = {
  _id: '640cdeabe46091b9c3f8939c',
  name: 'John Due',
  email: 'j.due@superemailservice.com',
  password: '1234567',
  createdDate: new Date('2023-03-13T14:00:43.000+00:00'),
} as User;

const hashedPass =
  '$2b$10$Vb4qAQUFKZu08hSGCS1IB.AT6aM4Gg9SNLLg0RPrWeH3g/4Mr1SDS';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            getUserByUsernameAsync: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user with hashed the password', async () => {
      const spy = jest
        .spyOn(usersService, 'create')
        .mockResolvedValueOnce({ ...mock, password: hashedPass } as User);

      const response = await service.signup(signupDto);
      expect(response.password).not.toEqual(mock.password);

      const { ['password']: removedProperty, ...passLessMock } = mock;
      const { ['password']: removedProperty2, ...passLessResponse } = response;
      expect(passLessResponse).toEqual(passLessMock);
    });

    it('should throw email duplication expection and BAD_REQUEST', async () => {
      class MongoErrorMock extends Error {
        code: number;
        constructor(message: string, code: number) {
          super(message);
          this.code = code;
        }
      }
      const spy = jest
        .spyOn(usersService, 'create')
        .mockRejectedValueOnce(
          new MongoErrorMock('ddd', MongoError.DuplicateKey),
        );
      await expect(async () => {
        await service.signup(signupDto);
      }).rejects.toThrowError(
        new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw general expection and INTERNAL_SERVER_ERROR', async () => {
      const spy = jest
        .spyOn(usersService, 'create')
        .mockRejectedValueOnce(new Error('some error'));
      await expect(async () => {
        await service.signup(signupDto);
      }).rejects.toThrowError(
        new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
  describe('validateUser', () => {
    it('should not found user with wrong email', async () => {
      const spy = jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(null);
      const response = await service.validateUser({
        email: 'wrong email',
        password: '1234567',
      });
      expect(response).toEqual(null);
    });

    it('should found user with wrong password', async () => {
      const spy = jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce({ ...mock, password: hashedPass } as User);

      const response = await service.validateUser({
        email: 'j.due@superemailservice.com',
        password: 'wrong password',
      });
      expect(response).toEqual(null);
    });

    it('should found user with right credentials', async () => {
      const spy = jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce({ ...mock, password: hashedPass } as User);
      const response = await service.validateUser({
        email: 'j.due@superemailservice.com',
        password: '1234567',
      });
      expect(response).toEqual({
        ...mock,
        password: hashedPass,
      } as User);
    });
  });
  describe('login', () => {
    it('should login user by returning user and token', async () => {
      const spy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce('sometoken');
      const { ['password']: removedProperty, ...passLessMock } = mock;
      expect(service.login(mock)).toEqual({
        user: JSON.parse(JSON.stringify(passLessMock)),
        access_token: 'sometoken',
      });
      expect(spy).toBeCalledWith({ username: mock.name, sub: mock._id });
    });
  });
});
