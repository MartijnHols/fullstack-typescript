import authenticateAccount from './_authenticateAccount'
import createSession from './_createSession'

const login = async (email: string, password: string): Promise<string> => {
  const account = await authenticateAccount(email, password)
  account.lastSeenAt = new Date()

  const [session] = await Promise.all([createSession(account), account.save()])

  return session.uniqueId
}

export default login
