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
it('returns an error for an invalid email', async () => {
  const { data } = await mutate({
    mutation: gql`
      mutation {
        register(email: "test@example") {
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
        "error": "INVALID_EMAIL",
      },
    }
  `)
})
it('returns an error for an already existing email', async () => {
  const { data } = await mutate({
    mutation: gql`
        mutation {
            register(email: "${EXISTING_ACCOUNT_EMAIL}") {
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
        "error": "EMAIL_ALREADY_USED",
      },
    }
  `)
})

it('succeeds given a proper new email', async () => {
  const { data } = await mutate({
    mutation: gql`
        mutation {
            register(email: "${NEW_ACCOUNT_EMAIL}") {
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

  const databaseEntry = await Account.findOne({
    where: { email: NEW_ACCOUNT_EMAIL },
  })
  expect(databaseEntry).toBeTruthy()
  expect(databaseEntry.id).toBe(Number(account.id))
  expect(databaseEntry.hasPassword).toBeFalsy()
})
it('returns an error when an unsafe password is provided', async () => {
  const { data } = await mutate({
    mutation: gql`
        mutation {
            register(email: "${NEW_ACCOUNT_EMAIL}", password: "test") {
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
        "error": "UNSAFE_PASSWORD",
      },
    }
  `)
})
it('sets password when provided', async () => {
  const { data } = await mutate({
    mutation: gql`
        mutation {
            register(email: "${NEW_ACCOUNT_EMAIL}", password: "test1234") {
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

  const databaseEntry = await Account.findOne({
    where: { email: NEW_ACCOUNT_EMAIL },
  })
  expect(databaseEntry).toBeTruthy()
  expect(databaseEntry.id).toEqual(Number(account.id))
  expect(databaseEntry.hasPassword).toBeTruthy()
})
