import authenticated from '~/utils/authenticated'

import changePasswordAction, {
  AccountUnavailableError,
  InvalidPasswordError,
  UnsafePasswordError,
} from '../actions/changePassword'
import { ChangePasswordError, MutationResolvers } from '../schema.generated'

const changePassword: MutationResolvers['changePassword'] = authenticated(
  async (_, { currentPassword, newPassword }, { session }) => {
    try {
      return {
        newSessionId: await changePasswordAction(
          await session.$get('account'),
          currentPassword,
          newPassword,
        ),
        error: null,
      }
    } catch (err) {
      if (err instanceof AccountUnavailableError) {
        return { newSessionId: null, error: ChangePasswordError.UNAVAILABLE }
      } else if (err instanceof InvalidPasswordError) {
        return {
          newSessionId: null,
          error: ChangePasswordError.INVALID_PASSWORD,
        }
      } else if (err instanceof UnsafePasswordError) {
        return {
          newSessionId: null,
          error: ChangePasswordError.UNSAFE_PASSWORD,
        }
      } else {
        throw err
      }
    }
  },
)

export default changePassword
