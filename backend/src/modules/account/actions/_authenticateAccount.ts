import Account from '../models/Account'

export class InvalidUsernameError extends Error {}
export class AccountUnavailableError extends Error {}
export class InvalidPasswordError extends Error {}

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
    // The security benefit of hiding if an email is in use is extremely
    // minimal, while it would require us to incapacitate email validation on
    // registration, lost password, login and any other place we might want to
    // include some sort of email search in the future, all of which are
    // important places to help the user.
    throw new InvalidUsernameError(
      `No account could be found for the username: ${username}`,
    )
  }
  if (!account.hasPassword) {
    throw new AccountUnavailableError(
      'This account has no password. Logging in to this account is not possible at this time.',
    )
  }
  if (!(await account.validatePassword(password))) {
    throw new InvalidPasswordError('This password is invalid')
  }
  return account
}

export default authenticateAccount
