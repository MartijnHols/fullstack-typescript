import { gql } from 'apollo-server-express'

export default gql`
  scalar DateTime
  scalar SessionID
  type Account {
    id: ID!
    email: String!
    verified: Boolean!
    createdAt: DateTime!
    lastSeenAt: DateTime!
  }

  extend type Mutation {
    """
    Register a new account.
    Expected errors: email-exists
    Rate limited.
    """
    register(email: String!): Account
      @rateLimitBurst(window: "1s", max: 1)
      @rateLimitSustained(window: "1d", max: 1000)
    """
    Login with the email and password. Upon success, returns a session ID.
    Expected errors: no-account, invalid-password
    Rate limited.
    """
    login(email: String!, password: String!): SessionID
      @rateLimitBurst(window: "1s", max: 5)
      @rateLimitSustained(window: "1d", max: 5000)
    """
    Change the password for the user's account. Upon success, all existing
    sessions will be invalidated and a new session ID will be returned that can
    be used to replace the user's now invalidated session.
    Expected errors: no-account, invalid-password, unsafe-password
    Rate limited.
    """
    changePassword(
      email: String!
      currentPassword: String!
      newPassword: String!
    ): SessionID
      @rateLimitBurst(window: "1s", max: 2)
      @rateLimitSustained(window: "1d", max: 1000)
  }
`
