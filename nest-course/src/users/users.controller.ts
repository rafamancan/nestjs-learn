import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  getUsers(): string {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): any {
    return this.usersService.findById(Number(id));
  }

  @Post()
  createUser(@Body() body: CreateUserDto): any {
    return this.usersService.create(body.name);
  }
}
