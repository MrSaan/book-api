import { Injectable } from "@nestjs/common";
import { User } from "src/users/entity/user.entity";
import { DataSource, Repository } from "typeorm";
import { LoginDto } from "../dto/login.dto";
import { RefreshToken } from "../entity/refresh-token.entity";

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {

    constructor(private dataSource: DataSource) {
        super(RefreshToken, dataSource.createEntityManager())
    }

    async createRefreshToken(user: User, ttl: number): Promise<RefreshToken> {
        const expiredAt = new Date()

        const refreshToken = this.create()
        refreshToken.user = user
        refreshToken.isRevoked = false
        expiredAt.setTime(expiredAt.getTime() + ttl)
        refreshToken.expiredAt = expiredAt

        return await refreshToken.save()
    }

}