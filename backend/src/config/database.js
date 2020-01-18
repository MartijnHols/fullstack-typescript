function env(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

const dialect = env('DATABASE_DIALECT')
const host = env('DATABASE_HOST')
const username = env('DATABASE_USERNAME')
const password = env('DATABASE_PASSWORD')
const database = env('DATABASE_DB_NAME')

module.exports = {
  dialect,
  host,
  username,
  password,
  database,
}
