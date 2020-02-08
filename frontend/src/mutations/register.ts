import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'

import { MutationRegisterArgs, RegisterResponse } from '../schema'
import requireData from '../utils/requireData'

const register = (apolloClient: ApolloClient<{}>) => (username: string) =>
  requireData(
    apolloClient.mutate<{ register: RegisterResponse }, MutationRegisterArgs>({
      mutation: gql`
        mutation($username: String!) {
          register(username: $username) {
            error
          }
        }
      `,
      variables: {
        username,
      },
    }),
  )

export default register
