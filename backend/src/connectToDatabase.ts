import { Sequelize } from 'sequelize'

function env(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export default function connectToDatabase() {
  const host = env('DATABASE_HOST')
  const username = env('DATABASE_USERNAME')
  const password = env('DATABASE_PASSWORD')
  const dbName = env('DATABASE_DB_NAME')

  const sequelize = new Sequelize(dbName, username, password, {
    host,
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/UTC',
    },
  })

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
