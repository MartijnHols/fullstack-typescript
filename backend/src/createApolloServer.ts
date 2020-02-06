import fs from 'fs'
import path from 'path'

import {
  ApolloServer,
  gql,
  ApolloServerExpressConfig,
  IResolvers,
} from 'apollo-server-express'
import express from 'express'
import { DocumentNode } from 'graphql'
import depthLimit from 'graphql-depth-limit'
import { createRateLimitDirective } from 'graphql-rate-limit'
import { PubSub } from 'graphql-subscriptions'

import Session from '~/modules/account/models/Session'

import {
  resolvers as accountResolvers,
  schema as accountSchema,
} from './modules/account'
// The standard TS compiler can't be configured to import graphql files :(
const schema = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')

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

const HEADER_NAME = 'authorization'

export interface ApolloServerContext {
  req: express.Request
  session?: Session
}

const createApolloServer = ({
  typeDefs = [],
  resolvers = [],
  ...others
}: Partial<ApolloServerExpressConfig> = {}) =>
  new ApolloServer({
    typeDefs: [
      rateLimitTypeDefs,
      schema,
      accountSchema,
      ...(Array.isArray(typeDefs) ? typeDefs : [typeDefs]),
    ] as DocumentNode | DocumentNode[] | string | string[],
    resolvers: [
      tempResolvers,
      accountResolvers as IResolvers,
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
    context: async ({ req }): Promise<ApolloServerContext> => {
      const sessionId = req.headers[HEADER_NAME]
      let session: Session | undefined = undefined
      if (sessionId) {
        session = await Session.findOne({
          where: {
            uniqueId: sessionId,
          },
        })
      }

      return {
        req,
        session,
      }
    },
    ...others,
  })

export default createApolloServer
