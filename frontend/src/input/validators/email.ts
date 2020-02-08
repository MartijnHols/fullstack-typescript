import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { FieldValidator } from 'final-form'
import validator from 'validator'

const email: FieldValidator<string> = value =>
  !validator.isEmail(value)
    ? i18n._(
        t('generic.validationError.email')`Please enter a valid email address.`,
      )
    : undefined

export default email
