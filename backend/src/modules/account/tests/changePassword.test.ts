import { gql } from 'apollo-server-express'

// TODO: Make root ~ import possible
import createTestClient, { Mutate } from '~/utils/createTestClient'
import setupDatabaseTests from '~/utils/setupDatabaseTests'

import Session from '../models/Session'
import createSession from '../mutations/_createSession'
import resolvers from '../resolvers'
import Account from '../models/Account'
import schema from '../schema'
import hashPassword from '../utils/hashPassword'

setupDatabaseTests()

let passwordHash!: string
let account!: Account
let mutate!: Mutate
beforeEach(async () => {
  passwordHash = await hashPassword('valid')
  account = await Account.create({
    email: 'test@example.nl',
    passwordHash,
  })
  const testClient = createTestClient({
    typeDefs: schema,
    resolvers,
  })
  mutate = testClient.mutate
})
it('throws for an invalid current password', async () => {
  await expect(
    mutate({
      mutation: gql`
        mutation {
          changePassword(
            username: "test@example.nl"
            currentPassword: "not my password"
            newPassword: "test1234"
          )
        }
      `,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"This password is invalid"`)
  // It doesn't change the password on an invalid current password
  expect(
    await Account.findOne({
      where: {
        passwordHash,
      },
    }),
  ).toBeTruthy()
})
it('throws for an unsafe new password', async () => {
  await expect(
    mutate({
      mutation: gql`
        mutation {
          changePassword(
            username: "test@example.nl"
            currentPassword: "not my password"
            newPassword: "test"
          )
        }
      `,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"The new password does not meet the requirements"`,
  )
})
it('changes the password given a correct current password', async () => {
  const { data } = await mutate({
    mutation: gql`
      mutation {
        changePassword(
          username: "test@example.nl"
          currentPassword: "valid"
          newPassword: "test1234"
        )
      }
    `,
  })
  expect(data?.changePassword).toBeTruthy()
  expect(typeof data?.changePassword).toBe('string')
  // Just to make sure the data is stored in the database
  await account.reload()
  expect(await account.validatePassword('test1234')).toBeTruthy()
})
// Log all other sessions out as a security measure in case the user is afraid
// his password might have leaked. Also log out the current session in case that
// might have been intercepted.
it('invalidates all sessions and starts a new one', async () => {
  await createSession(account)
  const oldSessions: Session[] = await Session.findAll({
    where: {
      accountId: account.id,
    },
  })
  // Sanity check
  expect(oldSessions).toHaveLength(1)

  // Test
  const { data } = await mutate({
    mutation: gql`
      mutation {
        changePassword(
          username: "test@example.nl"
          currentPassword: "valid"
          newPassword: "test1234"
        )
      }
    `,
  })
  // Sanity check2
  expect(data?.changePassword).toBeTruthy()

  // Validate
  const newSessions: Session[] = await Session.findAll({
    where: {
      accountId: account.id,
    },
  })
  expect(newSessions).toHaveLength(1)
  expect(newSessions[0].uniqueId).not.toEqual(oldSessions[0].uniqueId)
})
