import Account from '../models/Account'
import Session from '../models/Session'

export default function createSession(account: Account): Promise<Session> {
  const session = new Session()
  session.accountId = account.id
  return session.save()
}
