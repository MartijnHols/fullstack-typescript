import styled from '@emotion/styled'
import { Trans } from '@lingui/macro'
import React, { useRef } from 'react'

import Input from './components/Input'
import PageWrapper from './PageWrapper'

const Container = styled.div`
  padding: 15px;
`
const Heading = styled.h1`
  text-align: center;
`

const Login = () => {
  const input = useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (!input.current) {
      return
    }
    input.current.focus()
  }, [input])

  return (
    <PageWrapper>
      <Container>
        <Heading>
          <Trans id="login.heading">Login</Trans>
        </Heading>
        <label>
          Username: <Input type="text" name="username" ref={input} />
          <br />
          Username: <Input type="password" name="password" ref={input} />
        </label>
      </Container>
    </PageWrapper>
  )
}

export default Login
