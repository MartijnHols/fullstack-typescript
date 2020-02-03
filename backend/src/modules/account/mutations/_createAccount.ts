import { ApolloError } from 'apollo-server-express'

import Account from '../models/Account'

const createAccount = async (email: string) => {
  const existingAccount = await Account.findOne({
    where: {
      email,
    },
  })
  if (existingAccount) {
    throw new ApolloError(
      'This email address is already in use',
      'email-exists',
    )
  }

  const account = new Account()
  account.email = email
  return account.save()
}

export default createAccount
