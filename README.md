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

## Criando DTO e Entidades
`src/users/dto/create-user.dto.ts`
```ts
export class CreateUserDto {
  name: string;
}
```
`src/users/entities/user.entity.ts`
```ts
export class User {
  id: number;
  name: string;
}
```

Após a criação de ambos arquivos, vamos adicionar em nossa Service e Controller como dependências.
Os arquivos ficarão assim:

`src/users/users.controller.ts`
```ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  getUsers(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): User {
    return this.usersService.findById(Number(id));
  }

  @Post()
  createUser(@Body() body: CreateUserDto): User {
    return this.usersService.create(body);
  }
}

```

`src/users/user.service.ts`
```ts
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
```

# Swagger
Aqui iniciará a parte de documentação do nosso projeto.
Para instalar basta executar o comando a seguir:
```
yarn add @nestjs/swagger swagger-ui-express
```

Para configurarmos a documentação iremos alterar o arquivo:
`src/main.ts`

Ele ficará dessa maneira:
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();

```

Após a configuração basta acessar a url `http://localhost:3000/doc`

## Aperfeiçoando o uso do Swagger
`@ApitTags` = cria uma nova seção dentro da documentação
`@ApiOkResponse` = enriquece as informações sobre o retorno do método
`@ApiCreatedResponse` = o mesmo que o item acima, porém com status Code para Created.
`@ApiProperty` = pode ser utilizado na tipagem, sendo dto ou entidade, também enriquece nossa documentação.

Exemplo de como fica o código após a utilização dessas annotations:
`src/users/users.controller.ts`
```ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOkResponse({ type: User, isArray: true })
  @Get()
  getUsers(): User[] {
    return this.usersService.findAll();
  }

  @ApiOkResponse({ type: User, description: 'Returns an user' })
  @Get(':id')
  getUserById(@Param('id') id: string): User {
    return this.usersService.findById(Number(id));
  }

  @ApiCreatedResponse({ type: User })
  @Post()
  createUser(@Body() body: CreateUserDto): User {
    return this.usersService.create(body);
  }
}
```

`src/users/dto/create-user.dto.ts`
```ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;
}
```

`src/users/entities/user.entity.ts`
```ts
import { ApiProperty } from "@nestjs/swagger";

export class User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
```

Atualize a página: `http://localhost:3000/doc` e veja algumas diferenças.
Uma boa documentação da API é essencial, tanto para clientes externos quanto para equipe de desenvolvimento.

# Query Params
Para adicionar query params iremos alterar nosso controller e nossa service.

`src/users/users.controller.ts`
```ts
// ...

  @ApiOkResponse({ type: User, isArray: true })
  @ApiQuery({ name: 'name', required: false })
  @Get()
  getUsers(@Query('name') name: string): User[] {
    return this.usersService.findAll(name);
  }
// ...
```

`src/users/users.service.ts`
```ts
// ...

  findAll(name?: string): User[] {
    if (name) {
      return this.users.filter(user => user.name.includes(name));
    }
    return this.users;
  }

// ...
```

Uma vez que adicionamos a annotation `@ApiQuery({ name: 'name', required: false })` nossa documentação já fica atualizada também.

# Tratando Exceções e Erros
Nesse caso iremos adicionar uma verificação simples ao buscar o usuário, incluindo sua documentação no Swagger.

`src/users/users.controller.ts`
```ts
// ...

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
// ...
```

# Pipes
Vamos utilizar para transformar os dados que chegam na nossa API, para que não haja a necessidade de converter QueryParams toda vez que precisamos manipular
Para isso precisamos instalar as seguintes dependências:

`yarn add class-validator class-transformer`

[Documentação do class-validator](https://github.com/typestack/class-validator)

Iremos adicionar no arquivo `src/main.ts` as dependências e iniciar sua configuração, o arquivo ficará da seguinte maneira:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();

```

Para adicionar as regras nesse caso iremos especificar em nosso DTO que o nome do usuário precisa ter no máximo 20 caracteres e apenas AlfaNuméricos.

`src/users/dto/create-user.dto.ts`
```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsAlphanumeric()
  @MaxLength(20)
  name: string;
}
```

Uma vez que colocamos essas suas validações, precisamos alterar em nosso controller também o tipo de resposta caso o parâmetro name não esteja de acordo:

`src/users/users.controller.ts`
```ts
// ...

  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse()
  @Post()
  createUser(@Body() body: CreateUserDto): User {
    return this.usersService.create(body);
  }
// ...
```

# Usando CLI para gerar um CRUD
Já podemos notar que a ferramenta CLI do Nest é uma grande amiga no desenvolvimento.
Imaginaremos um cenário de adicionar um CRUD para Lista de Tarefas, iremos chamar de TODOS.

Execute o comando abaixo:
`nest g resource todos`

Podemos notas que todos os arquivos já foram criados:
```
src/todos/todos.controller.spec.ts
src/todos/todos.controller.ts
src/todos/todos.module.ts
src/todos/todos.service.spec.ts
src/todos/todos.service.ts
src/todos/dto/create-todo.dto.ts
src/todos/dto/update-todo.dto.ts
src/app.module.ts -> esse foi o único que apenas foi alterado
```