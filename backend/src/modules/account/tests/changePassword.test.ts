import { gql } from 'apollo-server-express'
import httpMocks from 'node-mocks-http'

// TODO: Make root ~ import possible
import createTestClient, { Mutate } from '~/utils/createTestClient'
import setupDatabaseTests from '~/utils/setupDatabaseTests'

import Session from '../models/Session'
import Account from '../models/Account'
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
  const testClient = createTestClient(
    undefined,
    await Session.create({
      uniqueId: 'test',
      accountId: account.id,
    }),
  )
  mutate = testClient.mutate
})
it('throws for an invalid current password', async () => {
  expect(
    await mutate({
      mutation: gql`
        mutation {
          changePassword(
            currentPassword: "not my password"
            newPassword: "test1234"
          ) {
            newSessionId
            error
          }
        }
      `,
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "data": Object {
        "changePassword": Object {
          "error": "INVALID_PASSWORD",
          "newSessionId": null,
        },
      },
      "errors": undefined,
      "extensions": undefined,
      "http": Object {
        "headers": Headers {
          Symbol(map): Object {},
        },
      },
    }
  `)
  // It doesn't change the password on an invalid current password
  expect(
    await Account.findOne({
      where: {
        passwordHash,
      },
    }),
  ).toBeTruthy()
})
it('requires authentication', async () => {
  await expect(
    mutate({
      mutation: gql`
        mutation {
          changePassword(
            currentPassword: "not my password"
            newPassword: "test"
          ) {
            newSessionId
            error
          }
        }
      `,
    }),
  ).resolves.toBeTruthy()
  {
    const { mutate } = createTestClient({
      context: () => ({
        req: httpMocks.createRequest({
          ip: Date.now(),
        }),
        session: undefined,
      }),
    })
    await expect(
      mutate({
        mutation: gql`
          mutation {
            changePassword(
              currentPassword: "not my password"
              newPassword: "test"
            ) {
              newSessionId
              error
            }
          }
        `,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"You need to be authenticated to use this endpoint."`,
    )
  }
})
it('throws for an unsafe new password', async () => {
  expect(
    await mutate({
      mutation: gql`
        mutation {
          changePassword(currentPassword: "valid", newPassword: "test") {
            newSessionId
            error
          }
        }
      `,
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "data": Object {
        "changePassword": Object {
          "error": "UNSAFE_PASSWORD",
          "newSessionId": null,
        },
      },
      "errors": undefined,
      "extensions": undefined,
      "http": Object {
        "headers": Headers {
          Symbol(map): Object {},
        },
      },
    }
  `)
})
it('changes the password given a correct current password', async () => {
  const { data } = await mutate({
    mutation: gql`
      mutation {
        changePassword(currentPassword: "valid", newPassword: "test1234") {
          newSessionId
          error
        }
      }
    `,
  })
  expect(data?.changePassword?.newSessionId).toBeTruthy()
  expect(typeof data?.changePassword.newSessionId).toBe('string')
  expect(data?.changePassword.error).toBeNull()
  // It must store the new password in the database
  await account.reload()
  expect(await account.validatePassword('test1234')).toBeTruthy()
})
// Log all other sessions out as a security measure in case the user is afraid
// his password might have leaked. Also log out the current session in case that
// might have been intercepted.
it('invalidates all sessions and starts a new one', async () => {
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
        changePassword(currentPassword: "valid", newPassword: "test1234") {
          newSessionId
          error
        }
      }
    `,
  })
  // Sanity check2
  expect(data?.changePassword?.newSessionId).toBeTruthy()

  // Validate
  const newSessions: Session[] = await Session.findAll({
    where: {
      accountId: account.id,
    },
  })
  expect(newSessions).toHaveLength(1)
  expect(newSessions[0].uniqueId).not.toEqual(oldSessions[0].uniqueId)
})
