import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JoiValidationPipe } from './pipes/joi-validation.pipe';
import { createUserSchema } from './schemas/create-user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { updateUserSchema } from './schemas/update-user.schema';
import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageUserDto } from './dto/page-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get('pagination')
  @Roles('admin')
  pagination(@Query() query: PageUserDto): Promise<PageDto<UserResponseDto>> {
    return this.userService.pagination(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
