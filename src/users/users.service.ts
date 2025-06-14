import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserState } from './enums/user-state.enum';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const newUser = new this.userModel({
        ...createUserInput,
        registrationDate: new Date(),
      });
      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'El nombre de usuario ya está en uso, por favor elige otro.',
        );
      }
      throw error;
    }
  }

  async register(createUserInput: CreateUserInput): Promise<User> {
    const { email, username, password, name, roles, registrationDate, state } =
      createUserInput;

    // Verifica email y username unicos
    if (await this.userModel.findOne({ email })) {
      throw new BadRequestException('El email ya está registrado');
    }
    if (await this.userModel.findOne({ username })) {
      throw new BadRequestException('El username ya está en uso');
    }

    // Crea modelo
    const newUser = new this.userModel({
      name,
      email,
      username,
      password,
      roles: roles || [Role.USER],
      registrationDate: registrationDate || new Date(),
      state: state || UserState.ACTIVE,
    });

    return newUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOneByUsernameOrEmail(identifier: string) {
    return this.userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findUsersByIds(userIds: string[]): Promise<{ user: User }[]> {
    const users = await this.userModel.find({ _id: { $in: userIds } }).lean().exec();
    return users.map(user => ({ user }));
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserInput) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
