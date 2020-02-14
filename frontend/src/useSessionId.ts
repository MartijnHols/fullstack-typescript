import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const useSessionId = () => {
  const { data } = useQuery(gql`
    {
      sessionId @client
    }
  `)
  return data?.sessionId
}

export default useSessionId
