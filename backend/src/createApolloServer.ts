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
import { DateTimeResolver } from 'graphql-scalars'

import {
  resolvers as accountResolvers,
  schema as accountSchema,
  Session,
} from '~/modules/account'
import {
  resolvers as chatResolvers,
  schema as chatSchema,
} from '~/modules/chat'

// The standard TS compiler can't be configured to import graphql files :(
const schema = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')
const scalars = fs.readFileSync(path.join(__dirname, 'scalars.graphql'), 'utf8')

export const globalResolvers = {
  DateTime: DateTimeResolver,
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
  identifyContext: ctx => {
    if (ctx.req) {
      return ctx.req.ip
    }
    if (ctx.session) {
      return ctx.session.uniqueId
    }
    throw new Error('Unidentifiable user')
  },
}
const rateLimitBurstDirective = createRateLimitDirective(config)
// Big enough not to cap locations with a lot of users, but not too big to avoid damage
const rateLimitSustainedDirective = createRateLimitDirective(config)

const HEADER_NAME = 'sessionid'

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
      scalars,
      accountSchema,
      chatSchema,
      ...(Array.isArray(typeDefs) ? typeDefs : [typeDefs]),
    ] as DocumentNode | DocumentNode[] | string | string[],
    resolvers: [
      globalResolvers,
      accountResolvers as IResolvers,
      chatResolvers as IResolvers,
      ...(Array.isArray(resolvers) ? resolvers : [resolvers]),
    ],
    schemaDirectives: {
      rateLimitBurst: rateLimitBurstDirective,
      rateLimitSustained: rateLimitSustainedDirective,
    },
    subscriptions: {
      onConnect: async ({ sessionId }: { sessionId?: string }) => {
        if (sessionId) {
          const session = await Session.findOne({
            where: {
              uniqueId: sessionId,
            },
          })
          if (!session) {
            throw new Error('Session expired')
          }
          return { session }
        }

        throw new Error('You must be logged in to connect')
      },
    },
    validationRules: [depthLimit(10)],
    context: async ({ connection, req }): Promise<ApolloServerContext> => {
      if (connection) {
        return connection.context
      }
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
