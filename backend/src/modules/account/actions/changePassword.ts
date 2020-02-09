import Account from '../models/Account'
import Session from '../models/Session'
import isValidPassword from '../utils/isPasswordValid'
import createSession from './_createSession'

export class AccountUnavailableError extends Error {}
export class InvalidPasswordError extends Error {}
export class UnsafePasswordError extends Error {}

const changePassword = async (
  account: Account,
  currentPassword: string,
  newPassword: string,
) => {
  if (!account.hasPassword) {
    throw new AccountUnavailableError(
      'This account has no password. Changing password for this account is not possible at this time.',
    )
  }
  if (!(await account.validatePassword(currentPassword))) {
    throw new InvalidPasswordError('This password is invalid')
  }
  if (!isValidPassword(newPassword)) {
    throw new UnsafePasswordError(
      'The new password does not meet the requirements',
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
