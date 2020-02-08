import { ApolloError } from 'apollo-server-express'
import validator from 'validator'

import Account from '../models/Account'
import { RegisterError } from '../schema'

const createAccount = async (username: string) => {
  if (!validator.isEmail(username)) {
    throw new ApolloError(
      'The username is not a valid email address',
      RegisterError.INVALID_USERNAME,
    )
  }
  const existingAccount = await Account.findOne({
    where: {
      email: username,
    },
  })
  if (existingAccount) {
    throw new ApolloError(
      'An account using this username already exists',
      RegisterError.USERNAME_ALREADY_EXISTS,
    )
  }

  const account = new Account()
  account.email = username
  return account.save()
}

export default createAccount
