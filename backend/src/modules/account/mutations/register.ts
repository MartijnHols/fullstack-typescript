import Account from '../models/Account'
import createAccount from './_createAccount'

const register = async (email: string): Promise<Account> => {
  const account = await createAccount(email)

  // TODO: Send verification email

  return account
}

export default register
