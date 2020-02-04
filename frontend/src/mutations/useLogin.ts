import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const useLogin = () =>
  useMutation<
    string,
    {
      username: string
      password: string
    }
  >(gql`
    mutation($username: String!, $password: String!) {
      login(username: $username, password: $password)
    }
  `)

export default useLogin
