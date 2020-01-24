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
