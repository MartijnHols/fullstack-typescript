/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gql } from 'apollo-server-express'
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing'
import { GraphQLResponse } from 'apollo-server-types'
import httpMocks from 'node-mocks-http'

import createApolloServer from './createApolloServer'
import sleep from './sleep'

// In order to make it harder to execute an effective DOS attack, we use several
// abuse protections.
describe('abuse protection', () => {
  // While these solutions are tested themselves, we're not married to those
  // implementations. These tests verify that they're implemented correctly,
  // and are doing their jobs, regardless of the library chosen.

  describe('rate limit', () => {
    let execute!: () => Promise<GraphQLResponse>
    const resolver = jest.fn(() => true)
    beforeEach(() => {
      const typeDefs = gql`
        type TestPrivateKey {
          id: String
        }
        extend type Query {
          test: TestPrivateKey
            @rateLimitBurst(
              window: "1s"
              max: 1
              message: "You are doing that too often."
            )
        }
      `
      const resolvers = {
        Query: {
          test: resolver,
        },
      }
      const server = createApolloServer({
        typeDefs,
        resolvers,
        context: {
          req: httpMocks.createRequest({
            ip: '127.0.0.1',
          }),
        },
      })
      const { query } = createTestClient(server)
      execute = () =>
        query({
          query: gql`
            query {
              test {
                id
              }
            }
          `,
        })
    })
    it('allows a single query', async () => {
      const { data, errors } = await execute()
      expect(errors).toBeFalsy()
      expect(data).toBeTruthy()
      expect(data!.test).toBeTruthy()
    })
    it('does not allow 2 queries within 1 second', async () => {
      await execute()
      const { data, errors } = await execute()
      expect(errors).toBeTruthy()
      // It doesn't matter if the entire data is omitted, or test's value is
      // omitted.
      expect(data && data.test).toBeFalsy()
      // But it mustn't call the resolver when limiting.
      expect(resolver).toHaveBeenCalledTimes(1)
    })
    it('resets after time expires', async () => {
      await execute()

      // We have to actually wait for a second since the data store does not use
      // timers. It probably uses timestamps instead.
      await sleep(1000)

      const { data, errors } = await execute()
      expect(errors).toBeFalsy()
      expect(data).toBeTruthy()
      expect(data!.test).toBeTruthy()
    })
  })

  // TODO: Complexity limiting

  // In order to make it harder to execute an effective DOS attack, we limit query depth
  describe('query depth', () => {
    // While graphql-depth-limit is tested, we're not married to that
    // implementation. Therefore we need to test that the depth is limited,
    // regardless of the implementation.

    let testClient!: ApolloServerTestClient
    beforeEach(() => {
      const typeDefs = gql`
        type NestingTest {
          id: String
          nested: NestingTest
        }
        extend type Query {
          test: NestingTest
        }
      `
      const resolvers = {
        Query: {
          test: () => null,
        },
      }
      const server = createApolloServer({
        typeDefs,
        resolvers,
      })
      testClient = createTestClient(server)
    })
    it('limits the depth of queries with 11 nested items', async () => {
      const { query } = testClient

      const { errors, data } = await query({
        query: gql`
          query {
            test {
              nested {
                nested {
                  nested {
                    nested {
                      nested {
                        nested {
                          nested {
                            nested {
                              nested {
                                nested {
                                  id
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      })
      expect(errors).not.toBe(undefined)
      expect(data).toBe(undefined)
    })
    it('accepts queries with a depth of 10 nested items or less', async () => {
      const { query } = testClient

      const { errors, data } = await query({
        query: gql`
          query {
            test {
              nested {
                nested {
                  nested {
                    nested {
                      nested {
                        nested {
                          nested {
                            nested {
                              nested {
                                id
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      })
      expect(errors).toBe(undefined)
      expect(data).not.toBe(undefined)
    })
  })
})
