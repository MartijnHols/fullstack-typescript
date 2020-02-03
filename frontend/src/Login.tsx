import styled from '@emotion/styled'
import { Trans } from '@lingui/macro'
import React, { useCallback, useRef } from 'react'
import { Form, Field } from 'react-final-form'

import sleep from './utils/sleep'

import Input from './components/Input'
import Submit from './input/Submit'
import PageWrapper from './PageWrapper'

const StyledForm = styled.form`
  margin: 0 auto;
  max-width: 400px;
  padding: 15px;
`
const Heading = styled.h1`
  text-align: center;
`
const FieldError = styled.small`
  color: red;
`

const Login = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (!inputRef.current) {
      return
    }
    inputRef.current.focus()
  }, [inputRef])

  const handleSubmit = useCallback(async values => {
    console.log(values)

    await sleep(5000)
  }, [])

  return (
    <PageWrapper>
      <Form onSubmit={handleSubmit}>
        {({ handleSubmit, submitting }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Heading>
              <Trans id="login.heading">Login</Trans>
            </Heading>
            <Field name="username">
              {({ input, meta }) => (
                <label>
                  <Trans id="login.username">Username</Trans>:{' '}
                  <Input
                    {...input}
                    type="text"
                    name="username"
                    ref={inputRef}
                  />
                  {meta.touched && meta.error && (
                    <FieldError>{meta.error}</FieldError>
                  )}
                </label>
              )}
            </Field>
            <br />
            <Field name="username">
              {({ input, meta }) => (
                <label>
                  <Trans id="login.password">Password</Trans>:{' '}
                  <Input {...input} type="password" name="password" />
                  {meta.touched && meta.error && (
                    <FieldError>{meta.error}</FieldError>
                  )}
                </label>
              )}
            </Field>
            <Submit loading={submitting}>
              <Trans id="login.submit">Login</Trans>
            </Submit>
          </StyledForm>
        )}
      </Form>
    </PageWrapper>
  )
}

export default Login
