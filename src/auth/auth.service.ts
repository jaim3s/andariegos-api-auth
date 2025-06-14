import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  generateJwt(user: any): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async signIn(
    identifier: string,
    pass: string,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.usersService.findOneByUsernameOrEmail(identifier);
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
    
    const payload = {
      sub: user._id,
      name: user.name,
      username: user.username,
      roles: user.roles,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        username: user.username,
        name: user.name,
        email: user.email,
        roles: user.roles,
        state: user.state,
      },
    };
  }

}