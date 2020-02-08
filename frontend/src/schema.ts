/* eslint-disable @typescript-eslint/no-explicit-any */
export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string | number
  String: string
  Boolean: boolean
  Int: number
  Float: number
  SessionID: string
  DateTime: Date
}

export interface Account {
  __typename?: 'Account'
  id: Scalars['ID']
  email: Scalars['String']
  verified: Scalars['Boolean']
  createdAt: Scalars['DateTime']
  lastSeenAt: Scalars['DateTime']
}

export enum ChangePasswordError {
  UNSAFE_PASSWORD = 'UNSAFE_PASSWORD',
  UNAVAILABLE = 'UNAVAILABLE',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
}

export interface ChangePasswordResponse {
  __typename?: 'ChangePasswordResponse'
  newSessionId: Maybe<Scalars['SessionID']>
  error: Maybe<ChangePasswordError>
}

export enum LoginError {
  INVALID_USERNAME = 'INVALID_USERNAME',
  ACCOUNT_UNAVAILABLE = 'ACCOUNT_UNAVAILABLE',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
}

export interface LoginResponse {
  __typename?: 'LoginResponse'
  sessionId: Maybe<Scalars['SessionID']>
  error: Maybe<LoginError>
}

export interface Mutation {
  __typename?: 'Mutation'
  /**
   * Change the password for the user's account. Upon success, all existing
   * sessions will be invalidated and a new session ID will be returned that can
   * be used to replace the user's now invalidated session.
   *
   * *Rate limited.*
   */
  changePassword: ChangePasswordResponse
  /**
   * Login with a username and password. Upon success, returns a session ID.
   *
   * *Rate limited.*
   */
  login: LoginResponse
  /**
   * Register a new account.
   * Expected errors: email-already-used
   * Rate limited.
   */
  register: RegisterResponse
  /**
   * Start password restoration. Upon success, This will send an email with a
   * link that can be used to set a new password.
   *
   * *Rate limited.*
   */
  restorePassword: RestorePassswordResponse
}

export interface MutationChangePasswordArgs {
  currentPassword: Scalars['String']
  newPassword: Scalars['String']
}

export interface MutationLoginArgs {
  username: Scalars['String']
  password: Scalars['String']
}

export interface MutationRegisterArgs {
  username: Scalars['String']
}

export interface MutationRestorePasswordArgs {
  username: Scalars['String']
}

export enum RegisterError {
  /** Username is incorrectly formatted. It should be a valid email address. */
  INVALID_USERNAME = 'INVALID_USERNAME',
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
}

export interface RegisterResponse {
  __typename?: 'RegisterResponse'
  account: Maybe<Account>
  error: Maybe<RegisterError>
}

export enum RestorePassswordError {
  INVALID_USERNAME = 'INVALID_USERNAME',
}

export interface RestorePassswordResponse {
  __typename?: 'RestorePassswordResponse'
  error: Maybe<RestorePassswordError>
}