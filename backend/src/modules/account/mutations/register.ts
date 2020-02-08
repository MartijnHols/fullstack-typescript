import Account from '../models/Account'
import createAccount from './_createAccount'

const register = async (
  username: string,
  password?: string,
): Promise<Account> => {
  const account = await createAccount(username, password)

  // TODO: Send verification email

  return account
}

export default register
