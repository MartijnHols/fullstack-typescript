import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { FORM_ERROR } from 'final-form'

function unknownFormError(error: never): never
function unknownFormError(error: string) {
  return {
    [FORM_ERROR]: i18n._(
      t('unknownFormError')`An unknown error occurred: ${error}`,
    ),
  }
}

export default unknownFormError
