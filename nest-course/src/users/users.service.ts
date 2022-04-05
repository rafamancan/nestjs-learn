import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

  private users: any = [{ id: 0, name: 'John' }, { id: 1, name: 'Mary' }];


  findAll(): any {
    return this.users;
  }

  findById(userId: number) {
    return this.users.find(user => user.id === userId);
  }

  create(name: string) {
    const user = { id: this.getNextId(), name };
    this.users.push(user);
    return user;
  }

  getNextId() {
    return this.users[this.users.length - 1].id + 1;
  }
}
