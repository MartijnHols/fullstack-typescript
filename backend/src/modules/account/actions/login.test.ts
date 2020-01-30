// TODO: Make root ~ import possible
import hashPassword from '../../../utils/hashPassword'
import setupDatabaseTests from '../../../utils/setupDatabaseTests'
import Account from '../models/Account'
import Session from '../models/Session'
import login from './login'

setupDatabaseTests()

beforeEach(async () => {
  await Account.create({
    email: 'test@example.nl',
    passwordHash: await hashPassword('valid'),
  })
})
it('fails on invalid credentials', async () => {
  await expect(login('test@example.nl', 'invalid')).rejects.toThrow()
})
it('succeeds on valid credentials', async () => {
  expect(await login('test@example.nl', 'valid')).toBeTruthy()
  const sessions = await Session.findAll()
  expect(sessions).toHaveLength(1)
})
it('returns a sessionId when logging in', async () => {
  const sessionId = await login('test@example.nl', 'valid')
  const sessions = await Session.findAll()
  // Logging in must create 1 session
  expect(sessions).toHaveLength(1)
  // Logging in must return the sessionId to be used with further requests
  expect(sessions[0].uniqueId).toBe(sessionId)
})
it('returns a different sessionId for each request', async () => {
  const sessionId1 = await login('test@example.nl', 'valid')
  const sessionId2 = await login('test@example.nl', 'valid')
  expect(sessionId1).not.toBe(sessionId2)
})
it('allows for multiple simultaneous sessions', async () => {
  await login('test@example.nl', 'valid')
  await login('test@example.nl', 'valid')
  const sessions = await Session.findAll()
  expect(sessions).toHaveLength(2)
})
