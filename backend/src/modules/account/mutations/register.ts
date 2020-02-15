import { UnsafePasswordError } from '../actions/_createAccount'
import registerAction, {
  EmailAlreadyExistsError,
  InvalidEmailError,
} from '../actions/register'
import { MutationResolvers, RegisterError } from '../schema.generated'

const register: MutationResolvers['register'] = async (
  _,
  { email, password },
) => {
  try {
    return {
      account: await registerAction(email, password ? password : undefined),
      error: null,
    }
  } catch (err) {
    if (err instanceof InvalidEmailError) {
      return { account: null, error: RegisterError.INVALID_EMAIL }
    } else if (err instanceof EmailAlreadyExistsError) {
      return { account: null, error: RegisterError.EMAIL_ALREADY_USED }
    } else if (err instanceof UnsafePasswordError) {
      return { account: null, error: RegisterError.UNSAFE_PASSWORD }
    } else {
      throw err
    }
  }
}

export default register
