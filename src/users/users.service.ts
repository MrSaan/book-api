import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UsersService {

    constructor(private userRepository: UserRepository) { }

    async createUser(createUserDto: CreateUserDto): Promise<void> {
        return await this.userRepository.createUser(createUserDto)
    }

    async validateUser(email: string, password: string): Promise<User> {
        return await this.userRepository.validateUser(email, password)
    }

    async findUserById(id: string): Promise<User> {
        return await this.userRepository.findOneBy({ id: id })
    }

}
