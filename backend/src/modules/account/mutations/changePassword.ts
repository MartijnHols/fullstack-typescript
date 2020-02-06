import { ApolloError } from 'apollo-server-express'

import Account from '../models/Account'
import Session from '../models/Session'
import { ChangePasswordError } from '../schema'
import isValidPassword from '../utils/isPasswordValid'
import createSession from './_createSession'

const changePassword = async (
  account: Account,
  currentPassword: string,
  newPassword: string,
) => {
  if (!account.hasPassword) {
    throw new ApolloError(
      'This account has no password. Changing password for this account is not possible at this time.',
      ChangePasswordError.UNAVAILABLE,
    )
  }
  if (!(await account.validatePassword(currentPassword))) {
    throw new ApolloError(
      'This password is invalid',
      ChangePasswordError.INVALID_PASSWORD,
    )
  }
  if (!isValidPassword(newPassword)) {
    throw new ApolloError(
      'The new password does not meet the requirements',
      ChangePasswordError.UNSAFE_PASSWORD,
    )
  }
  await account.setPassword(newPassword)
  await Promise.all([
    account.save(),
    Session.destroy({
      where: {
        accountId: account.id,
      },
    }),
  ])
  const newSession = await createSession(account)
  return newSession.uniqueId
}

export default changePassword
