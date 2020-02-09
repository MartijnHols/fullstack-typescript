import validator from 'validator'
import isValidPassword from '~/modules/account/utils/isPasswordValid'

import Account from '../models/Account'

export class InvalidEmailError extends Error {}
export class EmailAlreadyExistsError extends Error {}
export class UnsafePasswordError extends Error {}

const createAccount = async (email: string, password?: string) => {
  if (!validator.isEmail(email)) {
    throw new InvalidEmailError(
      'The provided email is not a valid email address',
    )
  }
  const existingAccount = await Account.findOne({
    where: {
      email,
    },
  })
  if (existingAccount) {
    throw new EmailAlreadyExistsError(
      'An account using this username already exists',
    )
  }

  const account = new Account()
  account.email = email
  if (password) {
    if (!isValidPassword(password)) {
      throw new UnsafePasswordError(
        'The new password does not meet the requirements',
      )
    }
    await account.setPassword(password)
  }
  return account.save()
}

export default createAccount
