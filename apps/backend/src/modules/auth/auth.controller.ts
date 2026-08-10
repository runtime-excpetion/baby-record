import { Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { BusinessException } from '../../common/exceptions/business.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Public()
@ApiTags('访问认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '使用部署密码登录' })
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    if (!this.authService.verifyPassword(dto.password)) {
      throw new BusinessException(ErrorCode.UNAUTHORIZED, '密码错误，请重试');
    }
    response.cookie(AuthService.COOKIE_NAME, this.authService.createSession(), this.authService.cookieOptions());
    return { authenticated: true, expiresIn: this.authService.sessionSeconds };
  }

  @Get('status')
  @ApiOperation({ summary: '查询当前登录状态' })
  status(@Req() request: Request) {
    return { authenticated: this.authService.isAuthenticated(request) };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: '退出登录并清除会话' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(AuthService.COOKIE_NAME, {
      httpOnly: true,
      secure: this.authService.cookieSecure,
      sameSite: 'strict',
      path: '/',
    });
    return { authenticated: false };
  }
}
