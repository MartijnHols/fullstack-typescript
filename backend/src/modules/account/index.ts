import Account from './models/Account'
import Session from './models/Session'

export const models = [Account, Session]

export * from './resolvers'
export { default as resolvers } from './resolvers'
