import { ApolloError } from 'apollo-server-express'

import Account from '../models/Account'
import { RestorePassswordError } from '../schema'

const restorePassword = async (username: string) => {
  const account = await Account.findOne({
    where: {
      email: username,
    },
  })
  if (!account) {
    throw new ApolloError(
      'There is no account with this username',
      RestorePassswordError.INVALID_USERNAME,
    )
  }

  // TODO: Send email
}

export default restorePassword
