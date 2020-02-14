import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { OperationDefinitionNode } from 'graphql'

import resolvers from './resolvers'

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql'
const GRAPHQL_WEB_SOCKET_ENDPOINT = 'ws://localhost:4000/graphql'

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
})
const wsLink = new WebSocketLink({
  uri: GRAPHQL_WEB_SOCKET_ENDPOINT,
  options: {
    reconnect: true,
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
  httpLink,
)

const createApolloClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    resolvers,
    link,
  })

export default createApolloClient
