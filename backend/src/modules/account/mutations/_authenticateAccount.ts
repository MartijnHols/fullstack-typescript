import { ApolloError } from 'apollo-server-express'
import { LoginError } from '../schema.generated'

import Account from '../models/Account'

const authenticateAccount = async (
  username: string,
  password: string,
): Promise<Account> => {
  const account = await Account.findOne({
    where: {
      email: username,
    },
  })
  if (!account) {
    // We differentiate invalid usernames to provide optimal user experience.
    // The security benefit of hiding if an email is in use is
    // extremely minimal, while it would require us to incapacitate email
    // validation on registration, lost password and login, all of which are
    // important places to help the user.
    throw new ApolloError(
      `No account could be found for the username: ${username}`,
      LoginError.INVALID_USERNAME,
    )
  }
  if (!account.hasPassword) {
    throw new ApolloError(
      'This account has no password. Logging in to this account is not possible at this time.',
      LoginError.ACCOUNT_UNAVAILABLE,
    )
  }
  if (!(await account.validatePassword(password))) {
    throw new ApolloError(
      'This password is invalid',
      LoginError.INVALID_PASSWORD,
    )
  }
  return account
}

export default authenticateAccount
