import { useApolloClient } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { i18n } from '@lingui/core'
import { t, Trans } from '@lingui/macro'
import React, { useCallback, useState } from 'react'
import { Form, Field } from 'react-final-form'
import { Link } from 'react-router-dom'

import FieldError from './input/FieldError'
import Input from './input/Input'
import Submit from './input/Submit'
import { compose, email, required } from './input/validators'
import register from './mutations/register'
import PageWrapper from './PageWrapper'
import routes from './routes'
import { RegisterError } from './schema.generated'
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
}

const Registration = () => {
  const autoFocusRef = useAutoFocus()
  const [isDone, setDone] = useState<boolean>(false)

  const apolloClient = useApolloClient()
  const handleSubmit = useCallback(
    async ({ username }: FormValues): Promise<object | void> => {
      const {
        data: {
          register: { error },
        },
      } = await register(apolloClient)(username)
      if (error) {
        switch (error) {
          case RegisterError.INVALID_USERNAME:
            return {
              username: i18n._(
                t(
                  'registration.invalidUsername',
                )`Your username needs to be a valid email address.`,
              ),
            }
          case RegisterError.USERNAME_ALREADY_EXISTS:
            return {
              username: i18n._(
                t(
                  'registration.usernameAlreadyExists',
                )`An account using this username already exists.`,
              ),
            }
          default:
            return unknownFormError(error)
        }
      } else {
        setDone(true)
      }
    },
    [apolloClient],
  )

  return (
    <PageWrapper>
      {isDone ? (
        <>
          Klaar
          <Link to={routes.login}>
            <Trans id="registration.done.login">Login</Trans>
          </Link>
        </>
      ) : (
        <>
          <Form<FormValues> onSubmit={handleSubmit}>
            {({ handleSubmit, submitting, submitError }) => (
              <StyledForm onSubmit={handleSubmit}>
                <Heading>
                  <Trans id="register.heading">Create account</Trans>
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
                <Submit loading={submitting} disabled={submitting}>
                  <Trans id="registration.submit">Create account</Trans>
                </Submit>
              </StyledForm>
            )}
          </Form>
          <Link to={routes.login}>
            <Trans id="registration.login">Already have an account?</Trans>
          </Link>
        </>
      )}
    </PageWrapper>
  )
}

export default Registration
