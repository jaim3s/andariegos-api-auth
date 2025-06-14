import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { UserGraphQL } from 'src/users/dto/user-graphql.dto';
import { LoginResponse } from './dto/login-response.dto';
import { GoogleAuthGuard } from './graphql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => LoginResponse)
  async login(
    @Args('identifier') identifier: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return this.authService.signIn(identifier, password);
  }

  @Query(() => UserGraphQL)
    async profile(@Context() context): Promise<UserGraphQL> {
    return context.req.user; 
  }

  @Query(() => String)
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle() {
    return 'Redirecting to Google...'; // No es necesario, redirige automáticamente
  }
}
