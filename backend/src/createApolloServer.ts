import { ApolloServer, gql } from 'apollo-server-express'
import { ApolloServerExpressConfig } from 'apollo-server-express'
import { DocumentNode } from 'graphql'
import depthLimit from 'graphql-depth-limit'
import { createRateLimitDirective } from 'graphql-rate-limit'
import { PubSub } from 'graphql-subscriptions'

import {
  resolvers as accountResolvers,
  typeDefs as accountTypeDefs,
} from './modules/account'
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
type GraphQLRateLimitConfig = Parameters<typeof createRateLimitDirective>[0]
const config: GraphQLRateLimitConfig = {
  identifyContext: ctx => ctx.req.ip,
}
const rateLimitBurstDirective = createRateLimitDirective(config)
// Big enough not to cap locations with a lot of users, but not too big to avoid damage
const rateLimitSustainedDirective = createRateLimitDirective(config)

const createApolloServer = ({
  typeDefs = [],
  resolvers = [],
  ...others
}: Partial<ApolloServerExpressConfig> = {}) =>
  new ApolloServer({
    typeDefs: [
      rateLimitTypeDefs,
      schema,
      accountTypeDefs,
      ...(Array.isArray(typeDefs) ? typeDefs : [typeDefs]),
    ] as DocumentNode | DocumentNode[] | string | string[],
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
    ...others,
  })

export default createApolloServer
