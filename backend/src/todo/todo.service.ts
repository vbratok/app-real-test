import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
    return this.todoModel.create({
      ...createTodoDto,
      author: user,
    });
  }

  async findAllForUser(filter: string, author: User) {
    const projection: { author: string; completed?: boolean } = {
      author: author._id,
    };
    if (filter === 'active') projection.completed = false;
    if (filter === 'completed') projection.completed = true;
    return this.todoModel.find(projection).populate('author');
  }

  async update(updateTodoDto: UpdateTodoDto, author: User) {
    await this.todoModel
      .findOneAndUpdate(
        {
          _id: updateTodoDto._id,
          author: author._id,
        },
        { completed: updateTodoDto.completed, text: updateTodoDto.text },
      )
      .exec();
  }

  async remove(id: string, author: User) {
    await this.todoModel
      .findByIdAndDelete({
        _id: id,
        author: author._id,
      })
      .exec();
  }
}
