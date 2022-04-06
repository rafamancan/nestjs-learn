import { Controller, Get, Post, Body, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiQuery, ApiNotFoundResponse } from '@nestjs/swagger'
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOkResponse({ type: User, isArray: true })
  @ApiQuery({ name: 'name', required: false })
  @Get()
  getUsers(@Query('name') name: string): User[] {
    return this.usersService.findAll(name);
  }

  @ApiOkResponse({ type: User, description: 'Returns an user' })
  @ApiNotFoundResponse()
  @Get(':id')
  getUserById(@Param('id') id: string): User {
    const user = this.usersService.findById(Number(id));

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @ApiCreatedResponse({ type: User })
  @Post()
  createUser(@Body() body: CreateUserDto): User {
    return this.usersService.create(body);
  }
}
