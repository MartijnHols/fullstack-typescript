import useCookie from '@use-hook/use-cookie'

import { Language } from '../locales'

const useLanguage = () => useCookie<Language>('language', Language.English)

export default useLanguage
