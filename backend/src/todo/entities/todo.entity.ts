import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type TodoDocument = HydratedDocument<Todo>;

@Schema()
export class Todo {
  @ApiProperty({ description: 'The id of the todo' })
  @Transform((value) => value.obj._id.toString())
  _id: string;

  @ApiProperty({ description: 'The todo text', required: true, maxLength: 300 })
  @Prop({ type: String, required: true, maxlength: 300 })
  text: string;

  @ApiProperty({
    description: 'Flag indicates whether the todo is completed',
    required: true,
    default: false,
  })
  @Prop({ type: Boolean, required: true, default: false })
  completed: boolean;

  @ApiProperty({
    description: 'The date todo has been created',
    default: 'now',
  })
  @Prop({ default: () => Date.now() })
  createdDate: Date;

  @ApiHideProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  @Exclude()
  author: User;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
