import { useApolloClient } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { i18n } from '@lingui/core'
import { t, Trans } from '@lingui/macro'
import React, { useCallback } from 'react'
import { Form, Field } from 'react-final-form'
import { Link, useHistory } from 'react-router-dom'

import FieldError from './input/FieldError'
import Input from './input/Input'
import Submit from './input/Submit'
import { compose, email, required } from './input/validators'
import login from './mutations/login'
import PageWrapper from './PageWrapper'
import routes from './routes'
import { LoginError } from './schema.generated'
import { setSessionId } from './sessionId'
import unknownFormError from './utils/unknownFormError'
import useAutoFocus from './utils/useAutoFocus'

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

const Login = () => {
  const autoFocusRef = useAutoFocus()
  const { push } = useHistory()

  const apolloClient = useApolloClient()
  const handleSubmit = useCallback(
    async ({ username, password }: FormValues): Promise<object | void> => {
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
                t(
                  'login.invalidUsername',
                )`We have no account with this username.`,
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
                t('login.accountUnavailable')`This account is locked.`,
              ),
            }
          default:
            return unknownFormError(error)
        }
      } else if (!sessionId) {
        throw new Error('No session ID received')
      } else {
        setSessionId(sessionId)
      }
    },
    [apolloClient, push],
  )

  return (
    <PageWrapper>
      <Form<FormValues> onSubmit={handleSubmit}>
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
                  label={<Trans id="login.username">Email</Trans>}
                  {...input}
                  autoComplete="username"
                  meta={meta}
                  ref={autoFocusRef}
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
