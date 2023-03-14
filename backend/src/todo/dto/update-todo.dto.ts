import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsString()
  @IsNotEmpty()
  readonly _id: string;

  @IsBoolean()
  readonly completed: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  readonly text: string;
}
