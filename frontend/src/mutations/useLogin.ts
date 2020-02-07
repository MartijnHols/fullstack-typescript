import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { LoginResponse, MutationLoginArgs } from '../schema'

const useLogin = () =>
  useMutation<LoginResponse, MutationLoginArgs>(gql`
    mutation($username: String!, $password: String!) {
      login(username: $username, password: $password)
    }
  `)

export default useLogin
