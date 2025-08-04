import { Module } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserController } from './user.controller';

@Module({
  imports: [ MongooseModule.forFeature([
    {
      name: User.name,    
      schema: UserSchema,     
    },
  ]),],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
