import fs from 'fs'
import path from 'path'

import Account from './models/Account'
import Session from './models/Session'

export const models = [Account, Session]

export { default as resolvers } from './resolvers'
// The standard TS compiler can't be configured to import graphql files :(
export const schema = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8',
)
