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
    const user = (await this.userService.findByEmail(email)) as UserDocument;
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...rest } = user.toObject();
      return plainToInstance(UserDto, rest);
    }
    throw new UnauthorizedException();
  }

  async login(
    user: UserDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: user._id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1d',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(token: string): Promise<{ access_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.findOne(payload.sub);
      if (!user) throw new UnauthorizedException();

      const newAccessToken = this.jwtService.sign(
        {
          sub: user._id,
          email: user.email,
          role: user.role,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '1d',
        },
      );

      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
