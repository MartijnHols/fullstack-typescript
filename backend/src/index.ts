import './config/env'
import createApolloServer, {
  pubsub,
  SOMETHING_CHANGED_TOPIC,
  tempResolvers,
} from './createApolloServer'
import accountResolvers, {
  typeDefs as accountTypeDefs,
} from './modules/account/resolvers'
import schema from './schema'

async function main() {
  const server = createApolloServer({
    typeDefs: [schema, accountTypeDefs],
    resolvers: [tempResolvers, accountResolvers],
  })

  const { url, subscriptionsUrl } = await server.listen()

  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)

  // For testing (PoC)
  setInterval(() => {
    pubsub.publish(SOMETHING_CHANGED_TOPIC, { somethingChanged: { id: '123' } })
  }, 1000)
}
main()
