import { ApolloError } from 'apollo-server-express'
import { DateTimeResolver } from 'graphql-scalars'

import changePassword from './mutations/changePassword'
import login from './mutations/login'
import register from './mutations/register'
import SessionID from './SessionID'
import { LoginResponse, RegisterResponse, Resolvers } from './schema'

async function makeResponse<
  ResponseFormat extends { [key: string]: PromiseResult } & {
    error: string | null
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PromiseResult extends any = any
>(fieldName: keyof ResponseFormat, promise: Promise<PromiseResult>) {
  try {
    const result = await promise
    return {
      [fieldName]: result,
      error: null,
    } as ResponseFormat
  } catch (err) {
    if (err instanceof ApolloError) {
      return {
        [fieldName]: null,
        error: err.extensions.code,
      } as ResponseFormat
    } else {
      throw err
    }
  }
}

const resolverMap: Omit<
  Resolvers<{}>,
  'Account' | 'RegisterResponse' | 'LoginResponse'
> = {
  SessionID,
  DateTime: DateTimeResolver,
  Mutation: {
    register: async (_, { username }) =>
      makeResponse<RegisterResponse>('account', register(username)),
    login: async (_, { username, password }) =>
      makeResponse<LoginResponse>('sessionId', login(username, password)),
    changePassword: async (_, { username, currentPassword, newPassword }) =>
      changePassword(username, currentPassword, newPassword),
  },
}

export default resolverMap
