import { IsNotEmpty } from "class-validator";

export class RefreshAccessToken {
    @IsNotEmpty()
    refresh_token: string
}