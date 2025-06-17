import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginResponse } from './dto/login-response.dto';
import { GoogleAuthGuard } from './graphql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { RegisterResponse } from './dto/register-response.output';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => RegisterResponse)
  async registerUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<RegisterResponse> {
    return this.authService.register(createUserInput);
  }

  @Public()
  @Mutation(() => LoginResponse)
  async login(
    @Args('identifier') identifier: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return this.authService.signIn(identifier, password);
  }

  @Query(() => String)
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle() {
    return 'Redirecting to Google...'; // No es necesario, redirige automáticamente
  }
}
