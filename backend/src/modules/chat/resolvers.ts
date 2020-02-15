import { ApolloServerContext } from '~/createApolloServer'

import sendMessage from './mutations/sendMessage'
import message from './subscriptions/message'
import { Resolvers } from './schema.generated'

const resolverMap: Partial<Resolvers<ApolloServerContext>> = {
  Mutation: {
    sendMessage,
  },
  Subscription: {
    message,
  },
}

export default resolverMap
