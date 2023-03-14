import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('Users Controller', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    _id: '640cdeabe46091b9c3f8939c',
    name: 'John Due',
    email: 'j.due@superemailservice.com',
    password: 'IloveJohnDue',
  };
  const mockUsersArray = [
    {
      _id: '640cdeabe46091b9c5f8939c',
      name: 'User #1',
      email: 'user1@email.com',
      password: '1234567--1$',
    },
    {
      _id: '640cdeabe26091b9c5f8939c',
      name: 'User #2',
      email: 'some.user.email@email.com',
      password: 'Kfjgeoisegf22',
    },
    mockUser,
    {
      _id: '640cdeabe46e91b9c5f8939c',
      name: 'User #3',
      email: 'some-email@email.com',
      password: 'sd334455dxsdf',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockUsersArray),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                name: mockUser.name,
                email: mockUser.email,
                password: mockUser.password,
                _id: id,
              }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Users', async () => {
      expect(controller.findAll()).resolves.toEqual([
        {
          _id: '640cdeabe46091b9c5f8939c',
          name: 'User #1',
          email: 'user1@email.com',
          password: '1234567--1$',
        },
        {
          _id: '640cdeabe26091b9c5f8939c',
          name: 'User #2',
          email: 'some.user.email@email.com',
          password: 'Kfjgeoisegf22',
        },
        mockUser,
        {
          _id: '640cdeabe46e91b9c5f8939c',
          name: 'User #3',
          email: 'some-email@email.com',
          password: 'sd334455dxsdf',
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a User', async () => {
      expect(controller.findOne('a strange id')).resolves.toEqual({
        ...mockUser,
        _id: 'a strange id',
      });
      expect(controller.findOne('a different id')).resolves.toEqual({
        ...mockUser,
        _id: 'a different id',
      });
    });
  });
});
