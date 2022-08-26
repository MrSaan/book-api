import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessToken } from './dto/refresh-access-token.dto';
import { LoginResponse } from './interface/login-response.interface';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService, private usersService: UsersService, private refreshTokenRepository: RefreshTokenRepository) { }

    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const { email, password } = loginDto

        const user = await this.usersService.validateUser(email, password)

        if (!user) {
            throw new UnauthorizedException('Wrong Email and Password')
        }

        const access_token = await this.createAccesToken(user)
        const refresh_token = await this.createRefreshToken(user)

        return { access_token, refresh_token } as LoginResponse
    }

    async createAccesToken(user: User): Promise<string> {
        const payload = {
            sub: user.id
        }

        const access_token = await this.jwtService.signAsync(payload)
        return access_token
    }

    async createRefreshToken(user: User): Promise<string> {
        const refreshToken = await this.refreshTokenRepository.createRefreshToken(user, +refreshTokenConfig.expiresIn)

        const payload = {
            jid: refreshToken.id
        }

        const refresh_token = await this.jwtService.signAsync(payload, refreshTokenConfig)
        return refresh_token
    }

    async refreshAccessToken(refreshTokenDto: RefreshAccessToken): Promise<{ access_token: string }> {
        const { refresh_token } = refreshTokenDto

        const payload = await this.decodeToken(refresh_token)
        const refreshToken = await this.refreshTokenRepository.findOne({ where: { id: payload.jid }, relations: ['user'] })

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is not found')
        }

        if (refreshToken.isRevoked) {
            throw new UnauthorizedException('Refresh token has been revoke')
        }

        const access_token = await this.createAccesToken(refreshToken.user)
        return { access_token }
    }

    async decodeToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token)
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new UnauthorizedException('refresh token is expired')
            } else {
                throw new InternalServerErrorException('Failed to decode token')
            }
        }
    }

}
