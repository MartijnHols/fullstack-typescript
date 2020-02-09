import loginAction, {
  InvalidUsernameError,
  AccountUnavailableError,
  InvalidPasswordError,
} from '../actions/login'
import { LoginError, MutationResolvers } from '../schema.generated'

const login: MutationResolvers['login'] = async (_, { username, password }) => {
  try {
    return {
      sessionId: await loginAction(username, password),
      error: null,
    }
  } catch (err) {
    if (err instanceof InvalidUsernameError) {
      return { sessionId: null, error: LoginError.INVALID_USERNAME }
    } else if (err instanceof AccountUnavailableError) {
      return { sessionId: null, error: LoginError.ACCOUNT_UNAVAILABLE }
    } else if (err instanceof InvalidPasswordError) {
      return { sessionId: null, error: LoginError.INVALID_PASSWORD }
    } else {
      throw err
    }
  }
}

export default login
