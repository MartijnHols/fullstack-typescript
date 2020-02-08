import ApolloClient from 'apollo-boost'

import resolvers from './resolvers'

const createApolloClient = () =>
  new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    resolvers,
  })

export default createApolloClient
