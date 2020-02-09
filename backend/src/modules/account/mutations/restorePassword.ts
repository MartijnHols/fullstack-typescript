import restorePasswordAction, {
  InvalidUsernameError,
} from '../actions/restorePassword'
import { MutationResolvers, RestorePassswordError } from '../schema.generated'

const restorePassword: MutationResolvers['restorePassword'] = async (
  _,
  { username },
) => {
  try {
    await restorePasswordAction(username)
    return {
      error: null,
    }
  } catch (err) {
    if (err instanceof InvalidUsernameError) {
      return { error: RestorePassswordError.INVALID_USERNAME }
    } else {
      throw err
    }
  }
}

export default restorePassword
