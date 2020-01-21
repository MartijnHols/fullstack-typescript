import authenticateAccount from './_authenticateAccount'

const login = async (email: string, password: string) => {
  const account = await authenticateAccount(email, password)
  account.lastSeenAt = new Date()

  // TODO: Create session

  return account.save()
}

export default login
