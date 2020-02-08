import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'

import { LoginResponse, MutationLoginArgs } from '../schema'
import requireData from '../utils/requireData'

const login = (apolloClient: ApolloClient<{}>) => (
  username: string,
  password: string,
) =>
  requireData(
    apolloClient.mutate<{ login: LoginResponse }, MutationLoginArgs>({
      mutation: gql`
        mutation($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            sessionId
            error
          }
        }
      `,
      variables: {
        username,
        password,
      },
    }),
  )

export default login
