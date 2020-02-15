import pubSub from '~/pubSub'
import authenticated from '~/utils/authenticated'

import { MESSAGE } from '../actions/sendMessage'
import { SubscriptionResolvers } from '../schema.generated'

const message: SubscriptionResolvers['message'] = {
  subscribe: authenticated(async (_, __, { session }) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pubSub.asyncIterator<any>(MESSAGE),
  ),
}

export default message
