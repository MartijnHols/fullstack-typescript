function env(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export const dialect = env('DATABASE_DIALECT')
export const host = env('DATABASE_HOST')
export const username = env('DATABASE_USERNAME')
export const password = env('DATABASE_PASSWORD')
export const database = env('DATABASE_DB_NAME')
