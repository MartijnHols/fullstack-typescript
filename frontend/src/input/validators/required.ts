import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { FieldValidator } from 'final-form'
import validator from 'validator'

/* eslint-disable @typescript-eslint/no-explicit-any */
const required: FieldValidator<any> = value =>
  validator.isEmpty(value)
    ? i18n._(t('generic.validationError.required')`This field is required.`)
    : undefined

export default required
