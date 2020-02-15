import fs from 'fs'
import path from 'path'

export const models = []

export { default as resolvers } from './resolvers'
// The standard TS compiler can't be configured to import graphql files :(
export const schema = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8',
)
