import { DateTimeResolver } from 'graphql-scalars'

import { ApolloServerContext } from '~/createApolloServer'
import authenticated from '~/utils/authenticated'
import makeResponse from '~/utils/makeResponse'

import changePassword from './mutations/changePassword'
import login from './mutations/login'
import register from './mutations/register'
import restorePassword from './mutations/restorePassword'
import SessionID from './SessionID'
import {
  ChangePasswordResponse,
  LoginResponse,
  RegisterResponse,
  Resolvers,
  RestorePassswordResponse,
} from './schema'

const resolverMap: Partial<Resolvers<ApolloServerContext>> = {
  SessionID,
  DateTime: DateTimeResolver,
  Mutation: {
    register: async (_, { username }) =>
      makeResponse<RegisterResponse>(register(username), 'account'),
    login: async (_, { username, password }) =>
      makeResponse<LoginResponse>(login(username, password), 'sessionId'),
    restorePassword: async (_, { username }) =>
      makeResponse<RestorePassswordResponse>(restorePassword(username)),
    changePassword: authenticated(
      async (_, { currentPassword, newPassword }, { session }) =>
        makeResponse<ChangePasswordResponse>(
          changePassword(
            await session.$get('account'),
            currentPassword,
            newPassword,
          ),
          'newSessionId',
        ),
    ),
  },
}

export default resolverMap
