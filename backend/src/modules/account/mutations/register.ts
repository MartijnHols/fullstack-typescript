import Account from '../models/Account'
import createAccount from './_createAccount'

const register = async (username: string): Promise<Account> => {
  const account = await createAccount(username)

  // TODO: Send verification email

  return account
}

export default register
