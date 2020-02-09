import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'

import { MutationRegisterArgs, RegisterResponse } from '../schema.generated'
import requireData from '../utils/requireData'

const register = (apolloClient: ApolloClient<{}>) => (
  email: string,
  password?: string,
) =>
  requireData(
    apolloClient.mutate<{ register: RegisterResponse }, MutationRegisterArgs>({
      mutation: gql`
        mutation($email: String!) {
          register(email: $email) {
            error
          }
        }
      `,
      variables: {
        email,
        password,
      },
    }),
  )

export default register
