import { Body, Controller, Post } from '@nestjs/common';
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
}
