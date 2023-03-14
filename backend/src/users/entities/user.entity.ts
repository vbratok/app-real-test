import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({ description: 'The id of the user' })
  @Transform((value) => value.obj._id.toString())
  _id: string;

  @ApiProperty({ description: 'The full name of the user', required: true })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    description: "The user's email",
    required: true,
    uniqueItems: true,
  })
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @ApiHideProperty()
  @Prop({ type: String, required: true })
  @Exclude()
  password: string;

  @ApiProperty({
    description:
      'For the test purpose. Created to test @Expose model decorator',
  })
  @Expose()
  get fullNameAndRandom(): string {
    return `${this.name} ${Math.floor(Math.random() * 90000) + 10000}`;
  }

  @ApiProperty({
    description: 'Flag indicates whether user is active',
    required: true,
    default: true,
  })
  @Prop({ type: Boolean, required: true, default: true })
  isActive: boolean;

  @ApiProperty({ description: 'The date user signed up', default: 'now' })
  @Prop({ default: () => Date.now() })
  createdDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
