import express from 'express'
import pinoLogger from 'express-pino-logger'
import http from 'http'

import './config/env'
import createApolloServer from './createApolloServer'

// Initialize the connection right away so we can use models directly
import './sequelize'

const graphqlPath = '/graphql'

function createServerInfo(server: http.Server, subscriptionsPath?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverInfo: any = {
    // TODO: Once we bump to `@types/node@10` or higher, we can replace cast
    // with the `net.AddressInfo` type, rather than this custom interface.
    // Unfortunately, prior to the 10.x types, this type existed on `dgram`,
    // but not on `net`, and in later types, the `server.address()` signature
    // can also be a string.
    ...(server.address() as {
      address: string
      family: string
      port: number
    }),
    server,
    subscriptionsPath,
  }

  // Convert IPs which mean "any address" (IPv4 or IPv6) into localhost
  // corresponding loopback ip. Note that the url field we're setting is
  // primarily for consumption by our test suite. If this heuristic is
  // wrong for your use case, explicitly specify a frontend host (in the
  // `frontends.host` field in your engine config, or in the `host`
  // option to ApolloServer.listen).
  let hostForUrl = serverInfo.address
  if (serverInfo.address === '' || serverInfo.address === '::')
    hostForUrl = 'localhost'

  serverInfo.url = require('url').format({
    protocol: 'http',
    hostname: hostForUrl,
    port: serverInfo.port,
    pathname: graphqlPath,
  })

  serverInfo.subscriptionsUrl = require('url').format({
    protocol: 'ws',
    hostname: hostForUrl,
    port: serverInfo.port,
    slashes: true,
    pathname: subscriptionsPath,
  })

  return serverInfo
}

async function main() {
  const apolloServer = createApolloServer()

  const app = express()
  app.use(pinoLogger())
  apolloServer.applyMiddleware({
    app,
    path: graphqlPath,
  })

  const httpServer = http.createServer(app)
  apolloServer.installSubscriptionHandlers(httpServer)

  await new Promise(resolve => {
    httpServer.once('listening', resolve)
    httpServer.listen({ port: 4000 })
  })

  const { url, subscriptionsUrl } = createServerInfo(httpServer)

  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
}
main()
