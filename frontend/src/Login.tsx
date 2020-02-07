import styled from '@emotion/styled'
import { i18n } from '@lingui/core'
import { t, Trans } from '@lingui/macro'
import React, { useCallback, useRef } from 'react'
import { Form, Field } from 'react-final-form'
import { Link } from 'react-router-dom'

import Input from './components/Input'
import Submit from './input/Submit'
import useLogin from './mutations/useLogin'
import PageWrapper from './PageWrapper'
import routes from './routes'
import { LoginError } from './schema'
import guaranteeResult from './utils/guaranteeResult'
import unknownFormError from './utils/unknownFormError'

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

  const [login] = useLogin()
  const handleSubmit = useCallback(
    async ({ username, password }: FormValues): Promise<object | void> => {
      const {
        data: {
          login: { sessionId, error },
        },
      } = await guaranteeResult(
        login({
          variables: { username, password },
        }),
      )
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
                t('login.invalidPassword')`This password is incorrect.`,
              ),
            }
          default:
            return unknownFormError(error)
        }
      } else {
        // TODO: set sessionId
        console.log(sessionId)
      }
    },
    [login],
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
            <Field name="username" defaultValue="">
              {({ input, meta }) => (
                <Label>
                  <Trans id="login.username">Username</Trans>:{' '}
                  <Input
                    {...input}
                    type="text"
                    autoComplete="username"
                    ref={inputRef}
                  />
                  {meta.touched && (meta.error || meta.submitError) && (
                    <FieldError>{meta.error || meta.submitError}</FieldError>
                  )}
                </Label>
              )}
            </Field>
            <Field name="password" defaultValue="">
              {({ input, meta }) => (
                <Label>
                  <Trans id="login.password">Password</Trans>:{' '}
                  <Input
                    {...input}
                    type="password"
                    autoComplete="current-password"
                  />
                  {meta.touched && (meta.error || meta.submitError) && (
                    <FieldError>{meta.error || meta.submitError}</FieldError>
                  )}
                </Label>
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
