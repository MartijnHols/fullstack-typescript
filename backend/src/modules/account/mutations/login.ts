import authenticateAccount from './_authenticateAccount'
import createSession from './_createSession'

const login = async (username: string, password: string): Promise<string> => {
  const account = await authenticateAccount(username, password)
  account.lastSeenAt = new Date()

  const [session] = await Promise.all([createSession(account), account.save()])

  return session.uniqueId
}

export default login
