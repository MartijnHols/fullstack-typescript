import { useApolloClient } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { i18n } from '@lingui/core'
import { t, Trans } from '@lingui/macro'
import { FieldValidator } from 'final-form'
import React, { useCallback, useRef } from 'react'
import { Form, Field } from 'react-final-form'
import { Link } from 'react-router-dom'
import validator from 'validator'

import Input from './components/Input'
import Submit from './input/Submit'
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
const email: FieldValidator<string> = value =>
  !validator.isEmail(value)
    ? i18n._(
        t('generic.validationError.email')`Please enter a valid email address`,
      )
    : undefined
/* eslint-disable @typescript-eslint/no-explicit-any */
const required: FieldValidator<any> = value =>
  validator.isEmpty(value)
    ? i18n._(t('generic.validationError.required')`This field is required.`)
    : undefined
const compose = (
  ...validators: Array<FieldValidator<any>>
): FieldValidator<any> => (...args: Parameters<FieldValidator<any>>) =>
  validators.reduce<string | void>(
    (error, validator: FieldValidator<any>) => error || validator(...args),
    undefined,
  )

const Login = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (!inputRef.current) {
      return
    }
    inputRef.current.focus()
  }, [inputRef])

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
    [apolloClient],
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
            <Field name="password" defaultValue="" validate={required}>
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
