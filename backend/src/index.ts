import { ApolloServer } from 'apollo-server'
import { PubSub } from 'graphql-subscriptions'

import './config/env'

import schema from './schema'
import accountResolvers, {
  typeDefs as accountTypeDefs,
} from './modules/account/resolvers'

export const pubsub = new PubSub()

export const SOMETHING_CHANGED_TOPIC = 'something_changed'

export const resolvers = {
  Subscription: {
    somethingChanged: {
      subscribe: () => pubsub.asyncIterator(SOMETHING_CHANGED_TOPIC),
    },
  },
}

async function createServer() {
  const server = new ApolloServer({
    typeDefs: [schema, accountTypeDefs],
    resolvers: [resolvers, accountResolvers],
    subscriptions: {
      onConnect: (connectionParams, webSocket) => {
        console.log('NEW_CONNECTION', connectionParams, webSocket)
      },
    },
  })

  const { url, subscriptionsUrl } = await server.listen()

  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)

  // For testing (PoC)
  setInterval(() => {
    pubsub.publish(SOMETHING_CHANGED_TOPIC, { somethingChanged: { id: '123' } })
  }, 1000)
}
createServer()
