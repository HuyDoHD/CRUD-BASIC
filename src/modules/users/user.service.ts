import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { PageDto } from 'src/common/dto/page.dto';
import { PageUserDto } from './dto/page-user.dto';
import { VoucherDocument, Voucher } from 'src/schemas/voucher.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Voucher.name) private voucherModel: Model<VoucherDocument>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = new this.userModel({
      ...dto,
      password: hashedPassword,
    });

    const saved = await newUser.save();
    const { password: _password, ...userData } = saved.toObject();
    return plainToInstance(UserResponseDto, userData);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => {
      const { password: _password, ...userData } = user.toObject();
      return plainToInstance(UserResponseDto, userData);
    });
  }

  async pagination(query: PageUserDto): Promise<PageDto<UserResponseDto>> {
    const skip = (query.page - 1) * query.limit;

    const whereCon: any = {};
    if (query.name) whereCon.name = { $regex: query.name, $options: 'i' };
    if (query.email) whereCon.email = { $regex: query.email, $options: 'i' };
    if (query.role) whereCon.role = query.role;
    if (query.status)
      whereCon.isActive = query.status === 'active' ? true : false;

    const [users, total] = await Promise.all([
      this.userModel.find(whereCon).skip(skip).limit(query.limit).exec(),
      this.userModel.countDocuments(whereCon).exec(),
    ]);

    const data = users.map((user) => {
      const { password: _password, ...userData } = user.toObject();
      return plainToInstance(UserResponseDto, userData);
    });

    return {
      data,
      meta: {
        total: total,
        page: query.page,
        limit: query.limit,
      },
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const { password: _password, ...userData } = user.toObject();
    return plainToInstance(UserResponseDto, userData);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (updateUserDto.newPassword) {
      const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
      updateUserDto.password = hashedPassword;
      delete updateUserDto.newPassword;
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser)
      throw new NotFoundException(`User with id ${id} not found`);
    const { password: _password, ...userData } = updatedUser.toObject();
    return plainToInstance(UserResponseDto, userData);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();
    await this.voucherModel.deleteMany({ userId: id }).exec();
    if (!deleted) throw new NotFoundException(`User with id ${id} not found`);
  }
}
