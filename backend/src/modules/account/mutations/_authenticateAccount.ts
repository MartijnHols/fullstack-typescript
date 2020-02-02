import { ApolloError } from 'apollo-server-express'

import Account from '../models/Account'

const authenticateAccount = async (
  email: string,
  password: string,
): Promise<Account> => {
  const account = await Account.findOne({
    where: {
      email,
    },
  })
  if (!account) {
    throw new ApolloError(
      `No account could be found for the email address: ${email}`,
      'no-account',
    )
  }
  if (!(await account.validatePassword(password))) {
    throw new ApolloError('This password is invalid', 'invalid-password')
  }
  return account
}

export default authenticateAccount
