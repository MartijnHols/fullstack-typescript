import { gql } from 'apollo-server-express'

import createTestClient, { Mutate } from '~/utils/createTestClient'
import setupDatabaseTests from '~/utils/setupDatabaseTests'

import Account from '../models/Account'
import hashPassword from '../utils/hashPassword'

import '~/tests/toBeAJSONDateTime'

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
        register(username: "test@example") {
          account {
            id
            email
            verified
            createdAt
            lastSeenAt
          }
          error
        }
      }
    `,
  })
  expect(data).toMatchInlineSnapshot(`
    Object {
      "register": Object {
        "account": null,
        "error": "INVALID_USERNAME",
      },
    }
  `)
})
it('returns an error for an already existing username', async () => {
  const { data } = await mutate({
    mutation: gql`
        mutation {
            register(username: "${EXISTING_ACCOUNT_EMAIL}") {
                account {
                    id
                    email
                    verified
                    createdAt
                    lastSeenAt
                }
                error
            }
        }
    `,
  })
  expect(data).toMatchInlineSnapshot(`
    Object {
      "register": Object {
        "account": null,
        "error": "USERNAME_ALREADY_EXISTS",
      },
    }
  `)
})

it('succeeds given a proper new username', async () => {
  const { data } = await mutate({
    mutation: gql`
        mutation {
            register(username: "${NEW_ACCOUNT_EMAIL}") {
                account {
                    id
                    email
                    verified
                    createdAt
                    lastSeenAt
                }
                error
            }
        }
    `,
  })
  expect(data?.register).toBeTruthy()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { account } = data!.register
  expect(account).toBeTruthy()
  expect(account.id).toBeTruthy()
  expect(account.email).toBe(NEW_ACCOUNT_EMAIL)
  expect(account.verified).toBeFalsy()
  expect(account.createdAt).toBeAJSONDateTime()
  expect(account.lastSeenAt).toBeAJSONDateTime()
})
