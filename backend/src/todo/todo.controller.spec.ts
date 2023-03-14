import { Test, TestingModule } from '@nestjs/testing';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { User } from 'src/users/entities/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

const createDto: CreateTodoDto = {
  text: 'Todo Text goes here',
};

const userMock = {
  _id: '640f2997fb5c556ecd662c8f',
  name: 'John Due',
  email: 'j.due@dummyserver.com',
} as User;

const mock = {
  _id: '640cdeabe46091b9c3f8939c',
  text: 'Todo Text goes here',
  completed: false,
  createdDate: new Date('2023-03-13T13:58:16.000+00:00'),
  author: userMock,
} as Todo;

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            create: jest.fn().mockResolvedValue(mock),
            findAllForUser: jest.fn().mockResolvedValue([mock, mock, mock]),
            update: jest.fn(),
            remove: jest.fn().mockResolvedValue(mock),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a todo', () => {
    expect(
      controller.create(createDto, { user: userMock } as RequestWithUser),
    ).resolves.toEqual(mock);
  });

  it('should return a list of all todoes', async () => {
    const findSpy = jest.spyOn(service, 'findAllForUser');

    const response = await controller.find('all', {
      user: userMock,
    } as RequestWithUser);
    expect(response).toEqual([mock, mock, mock]);
    expect(findSpy).toBeCalledWith('all', userMock);
  });

  it('should return a list of active todoes', async () => {
    const findSpy = jest.spyOn(service, 'findAllForUser');

    const response = await controller.find('active', {
      user: userMock,
    } as RequestWithUser);
    expect(response).toEqual([mock, mock, mock]);
    expect(findSpy).toBeCalledWith('active', userMock);
  });

  it('should return a list of completed todoes', async () => {
    const findSpy = jest.spyOn(service, 'findAllForUser');

    const response = await controller.find('completed', {
      user: userMock,
    } as RequestWithUser);
    expect(response).toEqual([mock, mock, mock]);
    expect(findSpy).toBeCalledWith('completed', userMock);
  });

  it('should update a todo', () => {
    expect(
      controller.update(
        { _id: 'some id', completed: true, text: 'some text' } as UpdateTodoDto,
        { user: userMock } as RequestWithUser,
      ),
    ).toEqual(undefined);
  });

  it('should remove a todo', () => {
    expect(
      controller.remove(mock._id, { user: userMock } as RequestWithUser),
    ).resolves.toEqual(mock);
  });
});
