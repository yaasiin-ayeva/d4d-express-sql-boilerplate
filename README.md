# d4d-express-sql-boilerplate

d4d-express-sql-boilerplate backend is a server side element to handle apis. Runs with SQL databases, Use TypeORM, JWT authentication &amp; seeders and migrations.

# Steps to run this project:

1. Run :

```bash
npm install
```

2. Setup your environment configurations after creating an .env file in the src folder :

```bash
cp .env.example .env
```

3. Finally Run :

```bash
npm run dev
```

## Seeding data to your database

By default, there's a default user that can be used to login. His details can be found in the `.env` file.

If you need to seed data to your database, run the following command :

```bash
npm run seed
```

## Migrations

By default, the model is synchronized with database. All old columns will be deleted if they are not present in the new model. You can change this behavior by setting the `DB_SYNC` environment variable to `0` in the `.env` file.

Anyway this behavior should be used ONLY for development purposes.

In production, I recommend using migrations.

```bash
npm run migration:create
npm run migration:generate
npm run migration:up
npm run migration:down
```

## IMPORTANT

Check `/postman` folder to get exported postman collection

[link-author]: https://github.com/yaasiin-ayeva

## TODO

- Add swagger documentation
- DevOps features
- Unit testing

Feel free to contribute on [GitHub](https://github.com/yaasiin-ayeva/d4d-express-sql-boilerplate)
