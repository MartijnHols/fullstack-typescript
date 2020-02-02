import Account from '../models/Account'

const createAccount = async (email: string) => {
  const account = new Account()
  account.email = email
  return account.save()
}

export default createAccount
