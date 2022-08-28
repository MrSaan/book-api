import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessToken } from './dto/refresh-access-token.dto';
import { LoginResponse } from './interface/login-response.interface';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        return this.authService.login(loginDto)
    }

    @Post('refresh-token')
    async refreshToken(@Body() refreshtokenDto: RefreshAccessToken): Promise<{ access_token: string }> {
        return this.authService.refreshAccessToken(refreshtokenDto)
    }

    @Patch(':id/revoke')
    @UseGuards(JwtGuard)
    async revokeRefreshToken(@Param('id') id: string): Promise<void> {
        return this.authService.revokeRefreshToken(id)
    }
}
