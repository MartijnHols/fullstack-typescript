import createAccount from './_createAccount'

const register = async (email: string) => {
  // TODO: Send verification email
  return createAccount(email)
}

export default register
