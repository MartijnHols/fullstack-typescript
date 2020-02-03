import { ApolloProvider } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import ApolloClient from 'apollo-boost'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import 'sanitize.css'
import 'sanitize.css/forms.css'
import 'sanitize.css/typography.css'

import './App.css'
import I18nProvider from './I18nProvider'
import { Language } from './locales'
import Router from './Router'
import * as colors from './theme/colors'

const Container = styled.div`
  color: ${colors.onBackground};
  font-size: 14px;
`

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
})

const App = () => {
  const isEnglish =
    window.location.pathname === '/en' ||
    window.location.pathname.startsWith('/en/')

  return (
    <Container>
      <I18nProvider language={isEnglish ? Language.English : Language.Dutch}>
        <ApolloProvider client={apolloClient}>
          <BrowserRouter basename={isEnglish ? '/en' : ''}>
            <Router />
          </BrowserRouter>
        </ApolloProvider>
      </I18nProvider>
    </Container>
  )
}

// TODO: https://medium.com/@brianhan/hot-reloading-cra-without-eject-b54af352c642

export default App
