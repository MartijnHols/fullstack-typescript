import { Dialect } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { dialect, host, username, password, database } from './config/database'

function connect() {
  return new Sequelize(database, username, password, {
    host,
    dialect: dialect as Dialect,
    dialectOptions: {
      timezone: 'Etc/UTC',
    },
    define: {
      freezeTableName: true,
    },
  })
}
function test(sequelize: Sequelize) {
  // We always test the connection during start so we get immediate feedback
  // whether things are running properly. Without this, we might only become
  // aware at the first request.
  sequelize.authenticate().then(
    () => {
      console.log('Database connection has been established successfully.')
    },
    (err: Error) => {
      console.error('Unable to connect to the database:', err)
      process.exit()
    },
  )
}

const sequelize = connect()
test(sequelize)

export default sequelize
