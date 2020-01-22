import { gql } from 'apollo-server'
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing'

import createApolloServer from './createApolloServer'

describe('abuse protection', () => {
  // TODO: Rate limiting

  // In order to reduce area susceptible to DOS attacks, we limit query depth
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
        type Query {
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
