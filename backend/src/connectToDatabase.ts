import { Dialect, Sequelize } from 'sequelize'

import { dialect, host, username, password, database } from './config/database'

export default function connectToDatabase() {
  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: dialect as Dialect,
    dialectOptions: {
      timezone: 'Etc/UTC',
    },
  })

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

  return sequelize
}
