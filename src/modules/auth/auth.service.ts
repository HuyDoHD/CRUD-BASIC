import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
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
    throw new HttpException('Email hoặc mật khẩu không đúng', HttpStatus.BAD_REQUEST);
  }

  async login(
    user: UserDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: user._id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '10s',
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
      console.log('Refresh token API hit at', token);
    
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      console.log('Payload', payload);
      const user = await this.userService.findOne(payload.sub);
      if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

      const newAccessToken = this.jwtService.sign(
        {
          sub: user._id,
          email: user.email,
          role: user.role,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '10s',
        },
      );

      return { access_token: newAccessToken };
    } catch (e) {
      throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);
    }
  }
}
