import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GoogleAuthGuard } from './graphql-auth.guard';
import { Role } from 'src/common/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Public()
  @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;

    // Aquí generas el JWT con tu servicio AuthService
    const jwt = this.authService.generateJwt(user);

    // Rediriges al frontend con el token en query params
    return res.redirect(`http://localhost:3000?token=${jwt}`);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Roles(Role.ADMIN)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}