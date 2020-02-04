import { gql } from 'apollo-server-express'

import createTestClient, { Mutate } from '~/utils/createTestClient'
import setupDatabaseTests from '~/utils/setupDatabaseTests'

import Account from '../models/Account'
import resolvers from '../resolvers'
import schema from '../schema'
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
  const testClient = createTestClient({
    typeDefs: schema,
    resolvers,
  })
  mutate = testClient.mutate
})
it('throws for an invalid email address', async () => {
  await expect(
    mutate({
      mutation: gql`
        mutation {
          register(username: "test@example") {
            id
            email
            verified
            createdAt
            lastSeenAt
          }
        }
      `,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Validation error: Validation isEmail on email failed"`,
  )
})
it('throws for an existing email address', async () => {
  await expect(
    mutate({
      mutation: gql`
        mutation {
          register(username: "${EXISTING_ACCOUNT_EMAIL}") {
            id
            email
            verified
            createdAt
            lastSeenAt
          }
        }
      `,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"This email address is already in use"`,
  )
})

it('succeeds given a proper new email address', async () => {
  const { data } = await mutate({
    mutation: gql`
        mutation {
            register(username: "${NEW_ACCOUNT_EMAIL}") {
                id
                email
                verified
                createdAt
                lastSeenAt
            }
        }
    `,
  })
  expect(data?.register).toBeTruthy()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const account = data!.register
  expect(account.id).toBeTruthy()
  expect(account.email).toBe(NEW_ACCOUNT_EMAIL)
  expect(account.verified).toBeFalsy()
  expect(account.createdAt).toBeAJSONDateTime()
  expect(account.lastSeenAt).toBeAJSONDateTime()
})
