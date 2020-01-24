import { gql } from 'apollo-server'
import { createRateLimitDirective } from 'graphql-rate-limit'

export const typeDefs = gql`
  directive @rateLimit(
    max: Int
    window: String
    message: String
    identityArgs: [String]
    arrayLengthField: String
  ) on FIELD_DEFINITION
`

export const directive = createRateLimitDirective({
  // TODO: Use request.ip instead
  // TODO: To make that possible, fix apollo-testing to include a req/res like https://github.com/zapier/apollo-server-integration-testing
  identifyContext: ctx => ctx.id,
})
