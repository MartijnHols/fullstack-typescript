## Database

```shell script
docker-compose up -d
docker-compose exec database mysql -uroot -ppassword -e"CREATE DATABASE example;"
docker-compose exec database mysql -uroot -ppassword -e"CREATE DATABASE test;"
```

## Commands

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `yarn test --watch` | Run tests while watching for changes |

# Structure

The server has a modular structure. This helps keep parts of the codebase focused. Modules should be separated based on the . Think

It may help to think of each module as a separate package. When your project grows big enough, it might help to actually make each module a separate workspace with their own `package.json`. This will require you to stay true to the separation and allows splitting up the root `package.json` so dependencies only used once are next to where they're being used.

## Why not group by type?

Grouping by file type makes it very easy to organize your code. This comes with a big downside however, as it will make the project harder to maintain as it grows. A `createAccount` mutation should have no relevancy with `createInvoice`. A modular structure forces you to think about how to separate your code and discourages mixing responsibilities. A good structure will help you filter away all the irrelevant bits.

The modular structure makes it easier to develop a new feature or extend an existing one as all irrelevant pieces are elsewhere. A module can be small. Some modules might have no more than 5 mutations, while the entire application could easily grow to have more than 50 mutations.

# Testing

Make integration tests on each mutation and query via Apollo. Do not test the mutation/query functions directly. They should be treated as irrelevant implementation details.

This does make the projected locked-in on GraphQL (and to a lesser extend apollo-server). This is a necessary sacrifice as type issues in the schema are a common cause for bugs.

It could be considered to test both the mutation/query functions and the Apollo-Server. Usually the duplicated tests would not be worth it as both would need to test the exact same things. It is more important to test the GraphQL calls as more issues can be prevented in doing so, and keeping duplicate code in sync is hard and a waste of effort.

## Run in band / database testing

Tests need to "run in band" in order to prevent conflicts with database interactions.

Tests are ran on an actual test database to keep things as real as possible and make it possible to replace our ORM without having to rewrite our tests.

## Do not mock code

Mocking causes vendor lock-in, making it harder to replace an implementation. Our tests are focused on functionality and an important goal is to make it easy to change implementations.
