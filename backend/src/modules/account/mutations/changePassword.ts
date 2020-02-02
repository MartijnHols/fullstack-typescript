import { GraphQLError } from 'graphql'
import Session from '../models/Session'
import isValidPassword from '../utils/isPasswordValid'
import authenticateAccount from './_authenticateAccount'
import createSession from './_createSession'

const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<string> => {
  if (!isValidPassword(newPassword)) {
    throw new GraphQLError('The new password does not meet the requirements')
  }
  const account = await authenticateAccount(email, currentPassword)
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
