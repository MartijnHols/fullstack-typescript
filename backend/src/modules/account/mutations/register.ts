import registerAction, {
  EmailAlreadyExistsError,
  InvalidEmailError,
} from '../actions/register'
import { MutationResolvers, RegisterError } from '../schema.generated'

const register: MutationResolvers['register'] = async (_, { email }) => {
  try {
    return {
      account: await registerAction(email),
      error: null,
    }
  } catch (err) {
    if (err instanceof InvalidEmailError) {
      return { account: null, error: RegisterError.INVALID_EMAIL }
    } else if (err instanceof EmailAlreadyExistsError) {
      return { account: null, error: RegisterError.EMAIL_ALREADY_USED }
    } else {
      throw err
    }
  }
}

export default register
