import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import MongooseClassSerializerInterceptor from '../utils/mongooseClassSerializer.interceptor';
import RequestWithUser from '../auth/requestWithUser.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Todo } from './entities/todo.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('todo')
@Controller('todo')
@UseInterceptors(MongooseClassSerializerInterceptor(Todo))
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({ description: 'Creates todo item' })
  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: RequestWithUser) {
    return this.todoService.create(createTodoDto, req.user);
  }

  @ApiOperation({
    description:
      'Returns the list of todo items for a user with filtering option ',
  })
  @ApiParam({
    name: 'filter',
    description: 'The option to filter by',
    enum: ['all', 'active', 'completed'],
  })
  @Get(':filter')
  find(
    @Param('filter') filter: string = 'Active',
    @Req() req: RequestWithUser,
  ) {
    return this.todoService.findAllForUser(filter, req.user);
  }

  @ApiOperation({ description: 'Updates the todo item' })
  @Patch()
  update(@Body() updateTodoDto: UpdateTodoDto, @Req() req: RequestWithUser) {
    return this.todoService.update(updateTodoDto, req.user);
  }

  @ApiOperation({ description: "Removes the todo item by given todo's id" })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.todoService.remove(id, req.user);
  }
}
