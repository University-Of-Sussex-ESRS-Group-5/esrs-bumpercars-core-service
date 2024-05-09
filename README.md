# Bumper Cars Core Service

## Description
This project is the backend server of the core service for the "Bumper Cars" game.

## Installation

```bash
$ npm install
```

## Run PostgreSQL and Redis using Docker Compose
```bash
$ docker-compose up
```

## Initialize database
```bash
$ npm run migration:run
```

## Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API documentation
Access Swagger UI at http://localhost:3000/api for API endpoints and documentation.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
