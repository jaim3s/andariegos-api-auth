import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  generateJwt(user: any): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '1h' });
  }

  async findOneByUsernameOrEmail(identifier: string) {
    return this.userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
  }

  async register(createUserInput: CreateUserInput): Promise<{ access_token: string }> {
    const { email, username, password, roles, registrationDate } = createUserInput;

    if (await this.userModel.findOne({ email })) {
      throw new BadRequestException('El email ya está registrado');
    }

    if (await this.userModel.findOne({ username })) {
      throw new BadRequestException('El username ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email,
      username,
      password: hashedPassword,
      roles: roles || ['USER'],
      registrationDate: registrationDate || new Date(),
    });

    const savedUser = await newUser.save();

    const payload = {
      sub: savedUser._id,
      email: savedUser.email,
      roles: savedUser.roles,
    };

    const access_token = this.jwtService.sign(payload);

    return { access_token };
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