import styled from '@emotion/styled'
import React, { ReactNode } from 'react'

import Footer from './Footer'
import Header from './Header'

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;

  > * {
    flex: 0 0 auto;
  }
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

const PageWrapper = ({ children, header, footer }: Props) => (
  <Container>
    {header !== undefined ? header : <Header>MartijnHols's project</Header>}
    <Main>{children}</Main>
    {footer !== undefined ? footer : <Footer />}
  </Container>
)

export default PageWrapper
