import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { User } from 'src/schemas/user.schema';
import { UserService } from './user.service';
import { CreateUserGraphDto } from './dto/create-user-graph.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService
  ) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async users(@CurrentUser() user: User) {
    console.log(user)
    return this.userService.findAll();
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserGraphDto) {
    return this.userService.create(input);
  }
}
