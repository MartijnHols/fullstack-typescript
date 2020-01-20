import { IResolvers, gql } from 'apollo-server'
import Account from './models/Account'

export const typeDefs = gql`
  type Account {
    id: ID!
    email: String!
    verified: Boolean!
    createdAt: String!
    lastSeenAt: String!
  }

  extend type Query {
    accounts: [Account!]
    account(id: ID!): Account
  }
`

const resolverMap: IResolvers = {
  Query: {
    accounts(obj, args, context, info) {
      return Account.findAll()
    },
    account(obj, args, context, info) {
      return Account.findOne({
        where: {
          id: args.id,
        },
      })
    },
  },
}

export default resolverMap
