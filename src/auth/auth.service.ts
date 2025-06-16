import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
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
    console.log(identifier, pass);
    const response = await firstValueFrom(
    this.httpService.post('http://localhost:4002/graphql', {
      query: `
        query FindUser($identifier: String!) {
          findUser(identifier: $identifier) {
            name
            username
            email
            roles
            state
            password
          }
        }
      `,
      variables: {
        identifier,
      },
    })
    );
    const user = response.data?.data?.findUser;
    console.log(user);
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException("Contraseña incorrecta");
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