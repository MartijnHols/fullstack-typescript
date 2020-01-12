import styled from '@emotion/styled'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { WebSocketLink } from 'apollo-link-ws'
import gql from 'graphql-tag'
import React, { useEffect } from 'react'

import * as colors from './theme/colors'

const Container = styled.div`
  position: relative;
  min-height: 100%;
  background: ${colors.background};

  :before,
  :after {
    content: ' ';
    display: table;
  }
`

const Content = () => {
  useEffect(() => {
    // Apollo PoC
    const GRAPHQL_ENDPOINT = 'ws://localhost:4000/graphql'

    const wsLink = new WebSocketLink({
      uri: GRAPHQL_ENDPOINT,
      options: {
        reconnect: true,
      },
    })

    const apolloClient = new ApolloClient({
      cache: new InMemoryCache(),
      link: wsLink,
    })

    apolloClient
      .query({
        query: gql`
          query Books {
            books {
              title
              author
            }
          }
        `,
        variables: {},
      })
      .then(console.log)
    apolloClient
      .subscribe({
        query: gql`
          subscription onNewItem {
            somethingChanged {
              id
            }
          }
        `,
        variables: {},
      })
      .subscribe({
        next(data) {
          console.log(data)
        },
      })
  }, [])

  return <Container>Content</Container>
}

export default Content
