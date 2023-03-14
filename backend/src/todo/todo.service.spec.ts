import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';

const createDto: CreateTodoDto = { text: 'The todo text' };
const updateDto: UpdateTodoDto = {
  _id: '640cdeabe46e91b9c5f8939c',
  text: 'The todo text',
  completed: false,
};
const mock = {
  _id: '640cdeabe46e91b9c5f8939c',
  text: 'The todo text',
  completed: false,
  createdDate: new Date('2023-03-13T13:58:16.000+00:00'),
} as Todo;
const userMock = {
  _id: '640cdeabe46091b9c3f8939c',
  name: 'John Due',
  email: 'j.due@superemailservice.com',
  password: '1234567',
  createdDate: new Date('2023-03-13T14:00:43.000+00:00'),
} as User;

describe('TodoService', () => {
  let service: TodoService;
  let model: Model<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getModelToken('Todo'),
          useValue: {
            new: jest.fn().mockResolvedValue(mock),
            create: jest.fn().mockResolvedValue(
              Promise.resolve({
                ...mock,
                author: userMock,
              }),
            ),
            find: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            populate: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    model = module.get<Model<Todo>>(getModelToken('Todo'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new todo with author', async () => {
    const newCat = await service.create(createDto, userMock);
    expect(newCat).toEqual({
      ...mock,
      author: userMock,
    });
  });

  it('should find all todoes for user', async () => {
    const spy = jest.spyOn(model, 'find').mockReturnValue({
      populate: jest.fn().mockResolvedValueOnce([mock, mock, mock]),
    } as any);
    const response = await service.findAllForUser('all', userMock);
    expect(response).toEqual([mock, mock, mock]);
    expect(spy).toBeCalledWith({ author: userMock._id });
  });

  it('should find all active todoes for user', async () => {
    const spy = jest.spyOn(model, 'find').mockReturnValue({
      populate: jest.fn().mockResolvedValueOnce([mock, mock, mock]),
    } as any);
    const response = await service.findAllForUser('active', userMock);
    expect(response).toEqual([mock, mock, mock]);
    expect(spy).toBeCalledWith({ author: userMock._id, completed: false });
  });

  it('should find all completed todoes for user', async () => {
    const spy = jest.spyOn(model, 'find').mockReturnValue({
      populate: jest.fn().mockResolvedValueOnce([mock, mock, mock]),
    } as any);
    const response = await service.findAllForUser('completed', userMock);
    expect(response).toEqual([mock, mock, mock]);
    expect(spy).toBeCalledWith({ author: userMock._id, completed: true });
  });

  it('should find all todoes for user when filter param is wrong', async () => {
    const spy = jest.spyOn(model, 'find').mockReturnValue({
      populate: jest.fn().mockResolvedValueOnce([mock, mock, mock]),
    } as any);
    const response = await service.findAllForUser(
      'wrong filter param',
      userMock,
    );
    expect(response).toEqual([mock, mock, mock]);
    expect(spy).toBeCalledWith({ author: userMock._id });
  });

  it('should update todoes for user', async () => {
    const spy = jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mock),
    } as any);
    const response = await service.update(updateDto, userMock);
    expect(response).toEqual(undefined);
    expect(spy).toBeCalledWith(
      { _id: mock._id, author: userMock._id },
      { completed: updateDto.completed, text: updateDto.text },
    );
  });

  it('should remove todo ', async () => {
    const spy = jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mock),
    } as any);
    const response = await service.remove(mock._id, userMock);
    expect(response).toEqual(undefined);
    expect(spy).toBeCalledWith({ _id: mock._id, author: userMock._id });
  });
});
