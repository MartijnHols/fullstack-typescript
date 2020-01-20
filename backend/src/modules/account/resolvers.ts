import { IResolvers, gql, ApolloError } from 'apollo-server'

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
    changePassword(
      email: String!
      currentPassword: String!
      newPassword: String!
    ): Account
  }
`

const resolverMap: IResolvers = {
  Query: {
    accounts() {
      return Account.findAll()
    },
    account(obj, args) {
      return Account.findOne({
        where: {
          id: args.id,
        },
      })
    },
  },
  Mutation: {
    async register(obj, { email }: { email: string }) {
      const account = new Account()
      account.email = email
      return account.save()
    },
    async login(obj, { email, password }: { email: string; password: string }) {
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
      if (!(await account.validatePassword(password))) {
        throw new ApolloError('This password is invalid', 'invalid-password')
      }
      account.lastSeenAt = new Date()

      return account.save()
    },
    async changePassword(
      obj,
      {
        email,
        currentPassword,
        newPassword,
      }: { email: string; currentPassword: string; newPassword: string },
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
      if (!(await account.validatePassword(currentPassword))) {
        throw new ApolloError(`This password is invalid`, 'invalid-password')
      }
      await account.setPassword(newPassword)
      return account.save()
    },
  },
}

export default resolverMap
