import { ApolloServer, gql } from 'apollo-server-express'
import { DocumentNode } from 'graphql'
import depthLimit from 'graphql-depth-limit'
import { createRateLimitDirective } from 'graphql-rate-limit'
import { GraphQLRateLimitConfig } from 'graphql-rate-limit/build/main/lib/types'
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

export const rateLimitTypeDefs = gql`
  directive @rateLimitBurst(
    max: Int
    window: String
    message: String
    identityArgs: [String]
    arrayLengthField: String
  ) on FIELD_DEFINITION
  directive @rateLimitSustained(
    max: Int
    window: String
    message: String
    identityArgs: [String]
    arrayLengthField: String
  ) on FIELD_DEFINITION
`
const config: GraphQLRateLimitConfig = {
  // TODO: Use request.ip instead
  // TODO: To make that possible, fix apollo-testing to include a req/res like https://github.com/zapier/apollo-server-integration-testing
  identifyContext: ctx => ctx.id,
}
// We should prevent spam clicking in our interface, and so this is purely against abuse
const rateLimitBurstDirective = createRateLimitDirective(config)
// Big enough not to cap locations with a lot of users, but not too big to avoid damage
const rateLimitSustainedDirective = createRateLimitDirective(config)

const createApolloServer = ({
  typeDefs = [],
  resolvers = [],
}: {
  typeDefs?: DocumentNode | DocumentNode[]
  resolvers?: IResolvers | IResolvers[]
} = {}) =>
  new ApolloServer({
    typeDefs: [
      rateLimitTypeDefs,
      schema,
      accountTypeDefs,
      ...(Array.isArray(typeDefs) ? typeDefs : [typeDefs]),
    ],
    resolvers: [
      tempResolvers,
      accountResolvers,
      ...(Array.isArray(resolvers) ? resolvers : [resolvers]),
    ],
    schemaDirectives: {
      rateLimitBurst: rateLimitBurstDirective,
      rateLimitSustained: rateLimitSustainedDirective,
    },
    subscriptions: {
      onConnect: (connectionParams, webSocket) => {
        // console.log('NEW_CONNECTION', connectionParams, webSocket)
      },
    },
    validationRules: [depthLimit(10)],
  })

export default createApolloServer
