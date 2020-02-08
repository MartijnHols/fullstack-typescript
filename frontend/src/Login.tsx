import { useApolloClient } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { i18n } from '@lingui/core'
import { t, Trans } from '@lingui/macro'
import { ApolloClient } from 'apollo-client'
import React, { useRef } from 'react'
import { Form, Field } from 'react-final-form'
import { Link } from 'react-router-dom'
import FieldError from './input/FieldError'

import Input from './input/Input'
import Submit from './input/Submit'
import { compose, email, required } from './input/validators'
import login from './mutations/login'
import PageWrapper from './PageWrapper'
import routes from './routes'
import { LoginError } from './schema'
import unknownFormError from './utils/unknownFormError'

const StyledForm = styled.form`
  margin: 0 auto;
  max-width: 400px;
  padding: 15px;
`
const Heading = styled.h1`
  text-align: center;
`

interface FormValues {
  username: string
  password: string
}

const handleSubmit = (apolloClient: ApolloClient<{}>) => async ({
  username,
  password,
}: FormValues): Promise<object | void> => {
  const {
    data: {
      login: { sessionId, error },
    },
  } = await login(apolloClient)(username, password)
  if (error) {
    switch (error) {
      case LoginError.INVALID_USERNAME:
        return {
          username: i18n._(
            t('login.invalidUsername')`We have no account with this username.`,
          ),
        }
      case LoginError.INVALID_PASSWORD:
        return {
          password: i18n._(
            t('login.invalidPassword')`This password is incorrect.`,
          ),
        }
      case LoginError.ACCOUNT_UNAVAILABLE:
        return {
          password: i18n._(
            t('login.invalidPassword')`This password is incorrect.`,
          ),
        }
      default:
        return unknownFormError(error)
    }
  } else {
    apolloClient.writeData({ data: { sessionId } })
  }
}

const Login = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (!inputRef.current) {
      return
    }
    inputRef.current.focus()
  }, [inputRef])

  const apolloClient = useApolloClient()

  return (
    <PageWrapper>
      <Form<FormValues> onSubmit={handleSubmit(apolloClient)}>
        {({ handleSubmit, submitting, submitError }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Heading>
              <Trans id="login.heading">Login</Trans>
            </Heading>
            {submitError && <FieldError>{submitError}</FieldError>}
            <Field
              name="username"
              defaultValue=""
              validate={compose(required, email)}
            >
              {({ input, meta }) => (
                <Input
                  label={<Trans id="login.username">Username</Trans>}
                  {...input}
                  autoComplete="username"
                  meta={meta}
                  ref={inputRef}
                />
              )}
            </Field>
            <Field name="password" defaultValue="" validate={required}>
              {({ input, meta }) => (
                <Input
                  label={<Trans id="login.password">Password</Trans>}
                  {...input}
                  type="password"
                  autoComplete="current-password"
                  meta={meta}
                  ref={inputRef}
                />
              )}
            </Field>
            <Submit loading={submitting} disabled={submitting}>
              <Trans id="login.submit">Login</Trans>
            </Submit>
          </StyledForm>
        )}
      </Form>
      <Link to={routes.register}>
        <Trans id="login.registration">Create an account</Trans>
      </Link>
    </PageWrapper>
  )
}

export default Login
