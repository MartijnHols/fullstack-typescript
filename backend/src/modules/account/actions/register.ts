import createAccount, {
  EmailAlreadyExistsError,
  InvalidEmailError,
} from './_createAccount'

export { EmailAlreadyExistsError, InvalidEmailError }

const register = async (email: string, password?: string) => {
  const account = await createAccount(email, password)

  // TODO: Send verification email

  return account
}

export default register
