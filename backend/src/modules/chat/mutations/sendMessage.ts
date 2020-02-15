import authenticated from '~/utils/authenticated'

import sendMessageAction from '../actions/sendMessage'
import { MutationResolvers } from '../schema.generated'

const sendMessage: MutationResolvers['sendMessage'] = authenticated(
  async (_, { to, text }, { session }) => {
    const account = await session.$get('account')

    await sendMessageAction(account.email, to, text)

    return {
      error: null,
    }
  },
)

export default sendMessage
