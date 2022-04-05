import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  private users: User[] = [{ id: 0, name: 'John' }, { id: 1, name: 'Mary' }];


  findAll(): User[] {
    return this.users;
  }

  findById(userId: number) {
    return this.users.find(user => user.id === userId);
  }

  create(createUserDto: CreateUserDto): User {
    const user = { id: this.getNextId(), ...createUserDto };
    this.users.push(user);
    return user;
  }

  getNextId(): number {
    return this.users[this.users.length - 1].id + 1;
  }
}
