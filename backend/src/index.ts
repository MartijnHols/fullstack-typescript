import { ApolloServer } from 'apollo-server'
import { PubSub } from 'graphql-subscriptions'

import './config/env'

import schema from './schema'
import connectToDatabase from './connectToDatabase'

connectToDatabase()

export const pubsub = new PubSub()

export const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
]

export const SOMETHING_CHANGED_TOPIC = 'something_changed'

export const resolvers = {
  Query: {
    books: () => books,
  },
  Subscription: {
    somethingChanged: {
      subscribe: () => pubsub.asyncIterator(SOMETHING_CHANGED_TOPIC),
    },
  },
}

async function createServer() {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    subscriptions: {
      onConnect: (connectionParams, webSocket) => {
        console.log('NEW_CONNECTION', connectionParams, webSocket)
      },
    },
  })

  const { url, subscriptionsUrl } = await server.listen()

  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)

  setInterval(() => {
    pubsub.publish(SOMETHING_CHANGED_TOPIC, { somethingChanged: { id: '123' } })
  }, 1000)
}
createServer()
