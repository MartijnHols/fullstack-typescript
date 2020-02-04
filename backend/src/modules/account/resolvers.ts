import { IResolvers } from 'apollo-server-express'
import { DateTimeResolver } from 'graphql-scalars'

import changePassword from './mutations/changePassword'
import login from './mutations/login'
import register from './mutations/register'
import Account from './models/Account'
import SessionID from './SessionID'

const resolverMap: IResolvers = {
  SessionID,
  DateTime: DateTimeResolver,
  Mutation: {
    register: async (_, { username }: { username: string }): Promise<Account> =>
      register(username),
    login: async (
      obj,
      { username, password }: { username: string; password: string },
    ): Promise<string> => login(username, password),
    changePassword: async (
      obj,
      {
        username,
        currentPassword,
        newPassword,
      }: { username: string; currentPassword: string; newPassword: string },
    ): Promise<string> =>
      changePassword(username, currentPassword, newPassword),
  },
}

export default resolverMap
