import { gql } from 'apollo-server-express'

import createTestClient, { Mutate } from '~/utils/createTestClient'
import setupDatabaseTests from '~/utils/setupDatabaseTests'

import Account from '../models/Account'
import hashPassword from '../utils/hashPassword'

setupDatabaseTests()

const NEW_ACCOUNT_EMAIL = 'test@example.nl'
const EXISTING_ACCOUNT_EMAIL = 'existing@example.nl'

let mutate!: Mutate
beforeEach(async () => {
  await Account.create({
    email: EXISTING_ACCOUNT_EMAIL,
    passwordHash: await hashPassword('valid'),
  })
  const testClient = createTestClient()
  mutate = testClient.mutate
})
it('returns an error for an invalid username', async () => {
  const { data } = await mutate({
    mutation: gql`
      mutation {
        restorePassword(username: "${NEW_ACCOUNT_EMAIL}") {
          error
        }
      }
    `,
  })
  expect(data).toMatchInlineSnapshot(`
    Object {
      "restorePassword": Object {
        "error": "INVALID_USERNAME",
      },
    }
  `)
})

it('succeeds given an existing username', async () => {
  const { data } = await mutate({
    mutation: gql`
      mutation {
        restorePassword(username: "${EXISTING_ACCOUNT_EMAIL}") {
          error
        }
      }
    `,
  })
  expect(data).toMatchInlineSnapshot(`
    Object {
      "restorePassword": Object {
        "error": null,
      },
    }
  `)
  // TODO: Check for restore password token
  // TODO: Check for email
})
