import { ApolloProvider } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import 'sanitize.css'
import 'sanitize.css/forms.css'
import 'sanitize.css/typography.css'

import './App.css'
import createApolloClient from './createApolloClient'
import I18nProvider from './I18nProvider'
import { Language } from './locales'
import Router from './Router'
import * as colors from './theme/colors'
import useLanguage from './utils/useLanguage'

const Container = styled.div`
  color: ${colors.onBackground};
  font-size: 14px;
`

const App = () => {
  const [language] = useLanguage()

  return (
    <Container>
      <I18nProvider language={language}>
        <ApolloProvider client={createApolloClient()}>
          <BrowserRouter basename={language === Language.English ? '/en' : ''}>
            <Router />
          </BrowserRouter>
        </ApolloProvider>
      </I18nProvider>
    </Container>
  )
}

// TODO: https://medium.com/@brianhan/hot-reloading-cra-without-eject-b54af352c642

export default App
