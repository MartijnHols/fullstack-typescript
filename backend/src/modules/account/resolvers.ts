import { IResolvers, gql } from 'apollo-server-express'

import changePassword from './actions/changePassword'
import login from './actions/login'
import register from './actions/register'

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
      @rateLimitBurst(window: "1s", max: 1)
      @rateLimitSustained(window: "1d", max: 1000)
    login(email: String!, password: String!): Account
      @rateLimitBurst(window: "1s", max: 5)
      @rateLimitSustained(window: "1d", max: 5000)
    changePassword(
      email: String!
      currentPassword: String!
      newPassword: String!
    ): Account
      @rateLimitBurst(window: "1s", max: 2)
      @rateLimitSustained(window: "1d", max: 1000)
  }
`

// TODO: Remove these as they're just for PoC
const getAccounts = () => Account.findAll()
const getAccountById = (id: number) =>
  Account.findOne({
    where: {
      id,
    },
  })

const resolverMap: IResolvers = {
  Query: {
    accounts: () => getAccounts(),
    account: (_, { id }: { id: number }) => getAccountById(id),
  },
  Mutation: {
    register: async (_, { email }: { email: string }) => register(email),
    login: async (
      obj,
      { email, password }: { email: string; password: string },
    ) => login(email, password),
    changePassword: async (
      obj,
      {
        email,
        currentPassword,
        newPassword,
      }: { email: string; currentPassword: string; newPassword: string },
    ) => changePassword(email, currentPassword, newPassword),
  },
}

export default resolverMap
