import { useApolloClient } from '@apollo/react-hooks'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { i18n } from '@lingui/core'
import { t, Trans } from '@lingui/macro'
import React, { useCallback, useState } from 'react'
import { Form, Field } from 'react-final-form'
import { Link } from 'react-router-dom'
import Icon from './components/Icon'

import { ReactComponent as CheckIcon } from './icons/check-circle-regular.svg'
import FieldError from './input/FieldError'
import Input from './input/Input'
import Submit from './input/Submit'
import { compose, email, required } from './input/validators'
import register from './mutations/register'
import PageWrapper from './PageWrapper'
import routes from './routes'
import { RegisterError } from './schema.generated'
import * as colors from './theme/colors'
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
  email: string
  password: string
}

const Registration = () => {
  const autoFocusRef = useAutoFocus()
  const [isDone, setDone] = useState<boolean>(false)

  const apolloClient = useApolloClient()
  const handleSubmit = useCallback(
    async ({ email, password }: FormValues): Promise<object | void> => {
      const {
        data: {
          register: { error },
        },
      } = await register(apolloClient)(email, password)
      if (error) {
        switch (error) {
          case RegisterError.INVALID_EMAIL:
            return {
              username: i18n._(
                t(
                  'registration.invalidUsername',
                )`This doesn't appear to be a valid email address.`,
              ),
            }
          case RegisterError.EMAIL_ALREADY_USED:
            return {
              username: i18n._(
                t(
                  'registration.usernameAlreadyExists',
                )`An account using this email already exists.`,
              ),
            }
          case RegisterError.UNSAFE_PASSWORD:
            return {
              username: i18n._(
                t(
                  'registration.unsafePassword',
                )`This password is not strong enough.`,
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
        <div
          css={css`
            text-align: center;
            margin: 15px 0;
          `}
        >
          <div
            css={css`
              margin-bottom: 15px;
            `}
          >
            <Icon
              component={CheckIcon}
              css={css`
                font-size: 64px;
                color: ${colors.primary500};
              `}
            />
          </div>
          <Trans id="register.accountCreationComplete">
            Your account has been created.
            <br />
            You can now <Link to={routes.login}>login</Link>.
          </Trans>
        </div>
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
                  name="email"
                  defaultValue=""
                  validate={compose(required, email)}
                >
                  {({ input, meta }) => (
                    <Input
                      label={<Trans id="registration.username">Email</Trans>}
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
                      label={<Trans id="registration.password">Password</Trans>}
                      {...input}
                      type="password"
                      autoComplete="new-password"
                      meta={meta}
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
