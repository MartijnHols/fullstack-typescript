import styled from '@emotion/styled'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import * as colors from './theme/colors'
import routes from './routes'
import Header from './Header'

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;

  > * {
    flex: 0 0 auto;
  }
`
const Footer = styled.footer`
  background: ${colors.background};
  color: #fff;
  text-align: center;
  flex-grow: 0;
  border-top: 1px solid ${colors.grey200};
`
const Main = styled.main`
  flex: 1 1 auto;
  overflow: auto;
  position: relative;
`

interface Props {
  children: ReactNode
  header?: ReactNode | null
  footer?: ReactNode | null
}

// TODO: Replace language selection with cookie
const PageWrapper = ({ children, header, footer }: Props) => (
  <Container>
    {header !== undefined ? header : <Header>MartijnHols's project</Header>}
    <Main>{children}</Main>
    {footer !== undefined ? (
      footer
    ) : (
      <Footer>
        My new app. <Link to={routes.about}>About</Link>
      </Footer>
    )}
  </Container>
)

export default PageWrapper
