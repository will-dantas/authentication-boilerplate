<h1 align="center">
  Authentication Boilerplate Nest.JS 🔐
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework.

The project consists of an authentication pattern with Nest.JS. Using implementation of guards to manage access to API endpoints, as well as using a strategy, for this project an on-premises strategy was used, which involves configuring the main authentication flow, including user registration, login and token generation . This pattern will use Passport.js to handle authentication strategies and JWT (JSON Web Token) to secure the endpoints. And finally, the use of middleware to validate logins based on the credentials provided by the user.

## Installation

create a .env file from .env.example for integrate a JWT_SECRET and DATABASE_URL

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Authentication Boilerplate Nest.JS is [MIT licensed](LICENSE).

## Author
 - [William Marcos Dantas](https://www.linkedin.com/in/william-dantas)
