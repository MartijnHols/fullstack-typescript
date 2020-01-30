import { Dialect } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { dialect, host, username, password, database } from './config/sequelize'
import models from './models'

function connect() {
  return new Sequelize(database, username, password, {
    host,
    dialect: dialect as Dialect,
    dialectOptions: {
      timezone: 'Etc/UTC',
    },
    define: {
      freezeTableName: true,
      // Only add the fields when the decorators are used, don't add anything by
      // default
      timestamps: false,
      createdAt: false,
      // Without this, @CreatedAt would also add an updatedAt column. See https://github.com/RobinBuschmann/sequelize-typescript/issues/50
      updatedAt: false,
      deletedAt: false,
    },
    logging:
      process.env.DATABASE_VERBOSE === 'true'
        ? sql => console.log(`🗄️${sql}`)
        : false,
    models,
  })
}
function test(sequelize: Sequelize) {
  // We always test the connection during start so we get immediate feedback
  // whether things are running properly. Without this, we might only become
  // aware at the first request.
  sequelize.authenticate().then(
    () => {
      console.log('🗄 Database connection has been established successfully.')
    },
    (err: Error) => {
      console.error('🗄️ Unable to connect to the database:', err)
      process.exit(1)
    },
  )
}

const sequelize = connect()
if (process.env.NODE_ENV !== 'test') {
  test(sequelize)
}

export default sequelize
