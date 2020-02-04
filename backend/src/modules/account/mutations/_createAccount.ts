import { ApolloError } from 'apollo-server-express'

import Account from '../models/Account'

const createAccount = async (username: string) => {
  const existingAccount = await Account.findOne({
    where: {
      email: username,
    },
  })
  if (existingAccount) {
    throw new ApolloError(
      'This email address is already in use',
      'email-already-used',
    )
  }

  const account = new Account()
  account.email = username
  return account.save()
}

export default createAccount
