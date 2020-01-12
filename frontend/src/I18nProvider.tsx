import { Catalog, i18n } from '@lingui/core'
import { I18nProvider as LinguiI18nProvider } from '@lingui/react'
import React from 'react'

import { Language } from './locales'

const loadCatalog = (lang: Language) =>
  process.env.NODE_ENV !== 'production'
    ? import(
        /* webpackMode: "lazy", webpackChunkName: "i18n-[request]" */ `@lingui/loader!./locales/${lang}/messages.json`
      )
    : import(
        /* webpackMode: "lazy", webpackChunkName: "i18n-[request]" */ `./locales/${lang}/messages.js`
      )

interface Props {
  children: React.ReactNode
  language: Language
}

const I18nProvider = ({ children, language }: Props) => {
  const [isCorrectLanguage, setIsCorrectLanguage] = React.useState<boolean>(
    i18n.language === language,
  )

  React.useEffect(() => {
    if (isCorrectLanguage) {
      return
    }
    loadCatalog(language).then((catalog: Catalog) => {
      i18n.load({ [language]: catalog })
      i18n.activate(language)

      setIsCorrectLanguage(true)
    })
  }, [language, isCorrectLanguage])

  if (!isCorrectLanguage) {
    return null
  }

  return (
    <LinguiI18nProvider language={language} i18n={i18n}>
      {children}
    </LinguiI18nProvider>
  )
}

export default I18nProvider
