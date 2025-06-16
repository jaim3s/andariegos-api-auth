import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  generateJwt(user: any): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async findOneByUsernameOrEmail(identifier: string) {
    return this.userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
  }

  async signIn(
    identifier: string,
    pass: string,
  ): Promise<{ access_token: string; userId: string }> {
    console.log(identifier, pass);
    const user = await this.findOneByUsernameOrEmail(identifier);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException("Contraseña incorrecta");
    }
    
    const payload = {
      sub: user._id,
      username: user.username,
      roles: user.roles,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user._id.toString()
    };
  }

}