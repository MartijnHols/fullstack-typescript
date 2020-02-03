import styled from '@emotion/styled'
import { Trans } from '@lingui/macro'
import React, { useRef } from 'react'

import Input from './components/Input'
import Button from './input/Button'
import PageWrapper from './PageWrapper'

const Container = styled.div`
  margin: 0 auto;
  max-width: 400px;
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
          <Trans id="login.username">Username</Trans>:{' '}
          <Input type="text" name="username" ref={input} />
          <br />
          <Trans id="login.password">Password</Trans>:{' '}
          <Input type="password" name="password" ref={input} />
          <Button>
            <Trans id="login.submit">Login</Trans>
          </Button>
        </label>
      </Container>
    </PageWrapper>
  )
}

export default Login
