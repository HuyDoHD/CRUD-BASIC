import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { auditPlugin } from 'src/modules/audit/audit.plugin';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'user' })
@ObjectType()
export class User {
  @Field(() => ID, { name: 'id' })
  _id: string;

  @Prop({ type: String, required: true, trim: true })
  @Field()
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  @Field()
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, default: 'user' })
  @Field()
  role: string;

  @Prop({ type: Boolean, default: true })
  @Field()
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(auditPlugin, { modelName: 'users' });