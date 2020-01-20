import { IResolvers, gql, ApolloError } from 'apollo-server'
import Sequelize from 'sequelize'

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

  extend type Mutation {
    register(email: String!): Account
    login(email: String!, password: String!): Account
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
  Mutation: {
    async register(obj, { email }: { email: string }, context, info) {
      const account = new Account()
      account.email = email
      return account.save()
    },
    async login(
      obj,
      { email, password }: { email: string; password: string },
      context,
      info,
    ) {
      const account = await Account.findOne({
        where: {
          email,
        },
      })
      if (!account) {
        throw new ApolloError(
          `No account could be found for the email address: ${email}`,
          'no-account',
        )
      }
      if (!account.validatePassword(password)) {
        throw new ApolloError(`This password is invalid`, 'invalid-password')
      }
      account.lastSeenAt = new Date()

      return await account.save()
    },
  },
}

export default resolverMap
