import authenticateAccount from './_authenticateAccount'

const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
) => {
  const account = await authenticateAccount(email, currentPassword)
  await account.setPassword(newPassword)
  return account.save()
}

export default changePassword
