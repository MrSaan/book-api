import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { RefreshToken } from './entity/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), JwtModule.register(jwtConfig), UsersModule],
  providers: [AuthService, RefreshTokenRepository],
  controllers: [AuthController]
})
export class AuthModule { }
