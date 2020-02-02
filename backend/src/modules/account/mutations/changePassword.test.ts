// TODO: Make root ~ import possible
import setupDatabaseTests from '../../../utils/setupDatabaseTests'
import Account from '../models/Account'
import Session from '../models/Session'
import hashPassword from '../utils/hashPassword'
import changePassword from './changePassword'
import createSession from './_createSession'

setupDatabaseTests()

let passwordHash!: string
let account!: Account
beforeEach(async () => {
  passwordHash = await hashPassword('valid')
  account = await Account.create({
    email: 'test@example.nl',
    passwordHash,
  })
})
it('throws for an invalid current password', async () => {
  await expect(
    changePassword('test@example.nl', 'invalid', 'test1234'),
  ).rejects.toThrow()
})
it('throws for an unsafe new password', async () => {
  await expect(
    changePassword('test@example.nl', 'invalid', 'test'),
  ).rejects.toThrow()
})
it("doesn't change the password on an invalid current password", async () => {
  await expect(
    changePassword('test@example.nl', 'invalid', 'test1234'),
  ).rejects.toThrow()
  expect(
    await Account.findOne({
      where: {
        passwordHash,
      },
    }),
  ).toBeTruthy()
})
it('changes the password given a correct current password', async () => {
  expect(
    await changePassword('test@example.nl', 'valid', 'test1234'),
  ).toBeTruthy()
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
  expect(oldSessions).toHaveLength(1)
  await changePassword('test@example.nl', 'valid', 'test1234')
  const newSessions: Session[] = await Session.findAll({
    where: {
      accountId: account.id,
    },
  })
  expect(newSessions).toHaveLength(1)
  expect(newSessions[0].uniqueId).not.toEqual(oldSessions[0].uniqueId)
})
