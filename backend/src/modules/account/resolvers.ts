import { ApolloServerContext } from '~/createApolloServer'

import register from './mutations/register'
import login from './mutations/login'
import restorePassword from './mutations/restorePassword'
import changePassword from './mutations/changePassword'
import SessionID from './SessionID'
import { AccountResolvers, Resolvers } from './schema.generated'

const resolverMap: Overwrite<
  Partial<Resolvers<ApolloServerContext>>,
  {
    Account: Partial<AccountResolvers<ApolloServerContext>>
  }
> = {
  SessionID,
  Mutation: {
    register,
    login,
    restorePassword,
    changePassword,
  },
  Account: {
    canLogin: account => account.hasPassword,
  },
}

export default resolverMap
