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
    register: async (_, { email }: { email: string }): Promise<Account> =>
      register(email),
    login: async (
      obj,
      { email, password }: { email: string; password: string },
    ): Promise<string> => login(email, password),
    changePassword: async (
      obj,
      {
        email,
        currentPassword,
        newPassword,
      }: { email: string; currentPassword: string; newPassword: string },
    ): Promise<string> => changePassword(email, currentPassword, newPassword),
  },
}

export default resolverMap
