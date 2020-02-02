import Account from '../models/Account'
import createAccount from './_createAccount'

const register = async (email: string): Promise<Account> => {
  // TODO: Send verification email
  return createAccount(email)
}

export default register
