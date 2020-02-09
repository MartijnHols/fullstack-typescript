import Account from '../models/Account'

export class InvalidUsernameError extends Error {}

const restorePassword = async (username: string) => {
  const account = await Account.findOne({
    where: {
      email: username,
    },
  })
  if (!account) {
    throw new InvalidUsernameError('There is no account with this username')
  }

  // TODO: Send email
}

export default restorePassword
