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
        mutation($email: String!, $password: String) {
          register(email: $email, password: $password) {
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
