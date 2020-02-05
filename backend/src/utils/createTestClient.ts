import {
  ApolloServerTestClient,
  createTestClient as baseCreateTestClient,
} from 'apollo-server-testing'
import { GraphQLResponse } from 'apollo-server-types'
import httpMocks from 'node-mocks-http'

import createApolloServer from '../createApolloServer'

export type Mutate = (
  options: Omit<Parameters<ApolloServerTestClient['mutate']>[0], 'query'>,
) => Promise<GraphQLResponse>
export type Query = (
  options: Omit<Parameters<ApolloServerTestClient['query']>[0], 'mutate'>,
) => Promise<GraphQLResponse>

export default function createTestClient(
  options: Parameters<typeof createApolloServer>[0] = {},
): {
  mutate: Mutate
  query: Query
} {
  const server = createApolloServer({
    context: () => ({
      req: httpMocks.createRequest({
        ip: Date.now(),
      }),
    }),
    ...options,
  })
  const { mutate, query } = baseCreateTestClient(server)

  return {
    mutate: async options => {
      const result = await mutate(options)

      if (result.errors) {
        result.errors.forEach(error => {
          throw error
        })
      }

      return result
    },
    query: async options => {
      const result = await query(options)

      if (result.errors) {
        result.errors.forEach(error => {
          throw error
        })
      }

      return result
    },
  }
}
