import Account from '../models/Account'

const createAccount = async (email: string) => {
  const account = new Account()
  account.email = email
  return account.save()
}
const register = async (email: string) => {
  // TODO: Send verification email
  return createAccount(email)
}

export default register
