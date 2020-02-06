import httpMocks from 'node-mocks-http'
import Session from '~/modules/account/models/Session'

import createApolloServer from '../createApolloServer'

export default function createTestServer(
  options: Parameters<typeof createApolloServer>[0] = {},
  session?: Session,
) {
  return createApolloServer({
    context: () => ({
      req: httpMocks.createRequest({
        ip: Date.now(),
      }),
      session,
    }),
    ...options,
  })
}
