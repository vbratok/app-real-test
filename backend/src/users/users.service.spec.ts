import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const createUserDto: CreateUserDto = {
  name: 'John Due',
  email: 'j.due@superemailservice.com',
  password: '1234567',
};
const mock = {
  _id: '640cdeabe46091b9c3f8939c',
  name: 'John Due',
  email: 'j.due@superemailservice.com',
  password: 'IloveJohnDue',
} as User;

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const spy = jest.spyOn(model, 'create');
    const response = await service.create(createUserDto);
    expect(response).toEqual(undefined);
    expect(spy).toBeCalledWith(createUserDto);
  });

  it('should find one user by id', async () => {
    const spy = jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([mock, mock, mock]),
    } as any);
    const response = await service.findAll();
    expect(response).toEqual([mock, mock, mock]);
  });

  it('should find one user by id', async () => {
    const spy = jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mock),
    } as any);
    const response = await service.findOne(mock._id);
    expect(response).toEqual(mock);
    expect(spy).toBeCalledWith({ _id: mock._id });
  });

  it('should find one user by email', async () => {
    const spy = jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mock),
    } as any);
    const response = await service.findByEmail(mock.email);
    expect(response).toEqual(mock);
    expect(spy).toBeCalledWith({ email: mock.email });
  });
});
