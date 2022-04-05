# Aprendendo NestJS [Marius Espejo](https://www.youtube.com/watch?v=2n3xS89TJMI)

## Primeiros passos

### Instalando cli
```
npm i -g @nestjs/cli
```
OU
```
yarn global add @nestjs/cli
```

### Iniciando um projeto
```
nest new nome-do-seu-projeto
cd nome-do-seu-projeto
yarn start:dev
```
___

# Sobre Arquitetura de 3 camadas
[Bulletproof node.js project architecture 🛡️](https://dev.to/santypk4/bulletproof-node-js-project-architecture-4epf)


### Controllers
- Responsável por toda comunicação http
    - Verbos HTTP: GET, PUT, POST, DELETE, PATCH, etc.
    - Respostas com HTTP code: 404, 200, 201, 401, etc.
    - Se comunica com a Service
    - Não há regra de negócio aqui
### Services
- Regras de negócio
### Data Access Layer
- Comunicação com Banco de Dados

___
# Decorators
No Controller pro exemplo, a rota é feita com base na annotation: `@Controller()`

Com o código abaixo:
```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':id')
  getHelloId(@Param('id') id: string): string {
    return id;
  }
}
```

Uma vez que definimos os Decorators como:
```
/app = @Controller('app')

/hello = @Get('hello')
```
O acesso será feito da seguinte maneira:
`http://localhost:3000/app/hello`

Assim como para realizar o acesso com parâmetro id:
`http://localhost:3000/app/123123`

___

# CLI
Quando iniciamos o projeto utilizando o comando
`nest new nome-do-seu-projeto`, mas a cli não se limita apenas a isso, para quem está habituado com outros frameworks como Laravel, a cli é uma ferramenta importante para auxiliar o desenvolver a criar códigos.

## Criando um novo módulo
```
nest generate module users
```
Esse comando trará como resultado a criação do arquivo `src/users/users.modules.ts` e a atualização do arquivo `src/app.modules.ts`, já importando o novo módulo criado.

## Criando um novo Controller
```
nest generate controller users
```
Esse comando executará a criação dos arquivos `src/users/users.controller.spec.ts` e `src/users/users.controller.ts`, também atualizará nosso módulo criado previamente `src/users/users.module.ts`.

Os arquivos com `.spec.` são arquivos para testes.

## Criando um novo Service
```
nest generate service users
```
Com resultado parecido com o comando para gerar Controllers, realizará a criação dos arquivos `src/users/users.service.spec.ts` e  `src/users/users.service.ts`, também como a atualização do `src/users/users.module.ts`.



# Injetando a camada Service no Controller

`src/users/users.service.ts`
```ts
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
}
```

`src/users/users.controller.ts`
```ts
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

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
}
```