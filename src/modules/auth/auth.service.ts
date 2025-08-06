import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.userService.findByEmail(email) as UserDocument;
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...rest } = user.toObject(); 
      return plainToInstance(UserDto, rest);
    }
    throw new UnauthorizedException();
  }

  async login(user: UserDto): Promise<{ access_token: string }> {
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
