/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { gql } from 'apollo-server-express'

import createTestClient, { Mutate } from '~/utils/createTestClient'
import setupDatabaseTests from '~/utils/setupDatabaseTests'

import Account from '../models/Account'
import Session from '../models/Session'
import hashPassword from '../utils/hashPassword'

setupDatabaseTests()

let mutate!: Mutate
beforeEach(async () => {
  await Account.create({
    email: 'test@example.nl',
    passwordHash: await hashPassword('valid'),
  })
  const testClient = createTestClient({})
  mutate = testClient.mutate
})
it('fails on invalid credentials', async () => {
  const { data } = await mutate({
    mutation: gql`
      mutation {
        login(username: "test@example.nl", password: "not my password") {
          sessionId
          error
        }
      }
    `,
  })
  expect(data!.login).toMatchInlineSnapshot(`
    Object {
      "error": "INVALID_PASSWORD",
      "sessionId": null,
    }
  `)
})
describe('valid credentials', () => {
  const mutation = gql`
    mutation {
      login(username: "test@example.nl", password: "valid") {
        sessionId
        error
      }
    }
  `
  it('succeeds on valid credentials', async () => {
    const { data } = await mutate({ mutation })
    expect(data!.login).toBeTruthy()
    const { sessionId, error } = data!.login
    expect(error).toBeNull()
    const sessions = await Session.findAll()
    // Logging in must create 1 session
    expect(sessions).toHaveLength(1)
    // Logging in must return the sessionId to be used with further requests
    expect(sessions[0].uniqueId).toBe(sessionId)
  })
  it('returns a different sessionId for each request', async () => {
    const { data: data1 } = await mutate({ mutation })
    const { data: data2 } = await mutate({ mutation })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(data1!.login.sessionId).not.toBe(data2!.login.sessionId)
  })
  it('allows for multiple simultaneous sessions', async () => {
    await mutate({ mutation })
    await mutate({ mutation })
    const sessions = await Session.findAll()
    expect(sessions).toHaveLength(2)
  })
})
