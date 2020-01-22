import { ApolloServer } from 'apollo-server'
import { DocumentNode } from 'graphql'
import depthLimit from 'graphql-depth-limit'
import { PubSub } from 'graphql-subscriptions'
import { IResolvers } from 'graphql-tools'

import accountResolvers, {
  typeDefs as accountTypeDefs,
} from './modules/account/resolvers'
import schema from './schema'

export const pubsub = new PubSub()

export const SOMETHING_CHANGED_TOPIC = 'something_changed'
export const tempResolvers = {
  Subscription: {
    somethingChanged: {
      subscribe: () => pubsub.asyncIterator(SOMETHING_CHANGED_TOPIC),
    },
  },
}

const createApolloServer = ({
  typeDefs = [schema, accountTypeDefs],
  resolvers = [tempResolvers, accountResolvers],
}: {
  typeDefs?: DocumentNode | Array<DocumentNode> | string | Array<string>
  resolvers?: IResolvers | Array<IResolvers>
} = {}) =>
  new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
      onConnect: (connectionParams, webSocket) => {
        console.log('NEW_CONNECTION', connectionParams, webSocket)
      },
    },
    validationRules: [depthLimit(10)],
  })

export default createApolloServer
