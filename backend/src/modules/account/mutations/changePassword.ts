import { ApolloError } from 'apollo-server-express'

import Session from '../models/Session'
import isValidPassword from '../utils/isPasswordValid'
import authenticateAccount from './_authenticateAccount'
import createSession from './_createSession'

const changePassword = async (
  username: string,
  currentPassword: string,
  newPassword: string,
): Promise<string> => {
  if (!isValidPassword(newPassword)) {
    throw new ApolloError(
      'The new password does not meet the requirements',
      'unsafe-password',
    )
  }
  const account = await authenticateAccount(username, currentPassword)
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
