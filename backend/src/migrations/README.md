## Making a new migration:

```shell script
yarn sequelize-cli migration:generate --name <name>
```

## Migrating up/down

To migrate up or down you first need to compile the migrations. For a shorthand use `yarn db:migrate`

## DataTypes

See: https://sequelize.org/master/manual/model-basics.html#data-types

## Migrations for all models

I do not ever use Sequelize's model.sync() because I want full control over the migration behavior. Almost always I want to maintain data as well as possible, and I do not trust sync to handle that properly automatically.
