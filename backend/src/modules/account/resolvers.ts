import { ApolloError } from 'apollo-server-express'
import { DateTimeResolver } from 'graphql-scalars'

import changePassword from './mutations/changePassword'
import login from './mutations/login'
import register from './mutations/register'
import SessionID from './SessionID'
import { Resolvers } from './schema'

const resolverMap: Omit<Resolvers<{}>, 'Account' | 'LoginResponse'> = {
  SessionID,
  DateTime: DateTimeResolver,
  Mutation: {
    register: async (_, { username }) => register(username),
    login: async (_, { username, password }) => {
      try {
        const sessionId = await login(username, password)
        return {
          sessionId,
          error: null,
        }
      } catch (err) {
        if (err instanceof ApolloError) {
          return {
            sessionId: null,
            error: err.extensions.code,
          }
        } else {
          throw err
        }
      }
    },
    changePassword: async (_, { username, currentPassword, newPassword }) =>
      changePassword(username, currentPassword, newPassword),
  },
}

export default resolverMap
