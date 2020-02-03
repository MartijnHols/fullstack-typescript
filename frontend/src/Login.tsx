import { useApolloClient } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { Trans } from '@lingui/macro'
import { gql } from 'apollo-boost'
import React, { useCallback, useRef } from 'react'
import { Form, Field } from 'react-final-form'

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
const Label = styled.label`
  display: block;
  margin-bottom: 15px;
`
const FieldError = styled.small`
  color: red;
`

interface FormValues {
  username: string
  password: string
}

const Login = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (!inputRef.current) {
      return
    }
    inputRef.current.focus()
  }, [inputRef])

  const client = useApolloClient()
  const handleSubmit = useCallback(
    async ({ username, password }: FormValues) => {
      try {
        await client.mutate<
          string,
          {
            username: string
            password: string
          }
        >({
          mutation: gql`
            mutation($username: String!, $password: String!) {
              login(username: $username, password: $password)
            }
          `,
          variables: { username, password },
        })
      } catch (error) {
        console.log(error)
      }
    },
    [client],
  )

  return (
    <PageWrapper>
      <Form<FormValues> onSubmit={handleSubmit}>
        {({ handleSubmit, submitting }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Heading>
              <Trans id="login.heading">Login</Trans>
            </Heading>
            <Field name="username">
              {({ input, meta }) => (
                <Label>
                  <Trans id="login.username">Username</Trans>:{' '}
                  <Input
                    {...input}
                    type="text"
                    autoComplete="username"
                    ref={inputRef}
                  />
                  {meta.touched && meta.error && (
                    <FieldError>{meta.error}</FieldError>
                  )}
                </Label>
              )}
            </Field>
            <Field name="password">
              {({ input, meta }) => (
                <Label>
                  <Trans id="login.password">Password</Trans>:{' '}
                  <Input
                    {...input}
                    type="password"
                    autoComplete="current-password"
                  />
                  {meta.touched && meta.error && (
                    <FieldError>{meta.error}</FieldError>
                  )}
                </Label>
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
