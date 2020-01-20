import { gql } from 'apollo-server'

const schema = gql`
  # Query may not be empty: https://github.com/apollographql/graphql-tools/issues/648
  type Query {
    _empty: String
  }

  type Subscription {
    somethingChanged: Result
  }

  type Result {
    id: String
  }

  schema {
    query: Query
    subscription: Subscription
  }
`

export default schema
