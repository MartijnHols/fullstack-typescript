import { split } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { OperationDefinitionNode } from 'graphql'

import resolvers from './resolvers'
import { getSessionId } from './sessionId'

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql'
const GRAPHQL_WEB_SOCKET_ENDPOINT = 'ws://localhost:4000/graphql'

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
})
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    sessionId: getSessionId() || undefined,
  },
}))
const wsLink = new WebSocketLink({
  uri: GRAPHQL_WEB_SOCKET_ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: () => ({
      sessionId: getSessionId() || undefined,
    }),
  },
})
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(
      query,
    ) as OperationDefinitionNode
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink),
)

const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    resolvers,
    link,
  })

export default createApolloClient
