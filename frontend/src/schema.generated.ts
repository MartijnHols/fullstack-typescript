export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string | number,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  SessionID: string,
  DateTime: Date,
}

export interface Account {
   __typename?: 'Account',
  id: Scalars['ID'],
  email: Scalars['String'],
  verified: Scalars['Boolean'],
  createdAt: Scalars['DateTime'],
  lastSeenAt: Scalars['DateTime'],
  canLogin: Scalars['Boolean'],
}

export enum ChangePasswordError {
  UNSAFE_PASSWORD = 'UNSAFE_PASSWORD',
  UNAVAILABLE = 'UNAVAILABLE',
  INVALID_PASSWORD = 'INVALID_PASSWORD'
}

export interface ChangePasswordResponse {
   __typename?: 'ChangePasswordResponse',
  newSessionId?: Maybe<Scalars['SessionID']>,
  error?: Maybe<ChangePasswordError>,
}


export enum LoginError {
  INVALID_USERNAME = 'INVALID_USERNAME',
  ACCOUNT_UNAVAILABLE = 'ACCOUNT_UNAVAILABLE',
  INVALID_PASSWORD = 'INVALID_PASSWORD'
}

export interface LoginResponse {
   __typename?: 'LoginResponse',
  sessionId?: Maybe<Scalars['SessionID']>,
  error?: Maybe<LoginError>,
}

export interface Message {
   __typename?: 'Message',
  id: Scalars['ID'],
  /** 
 * I know making this `channel` and having separate tables with users will allow
   * us to make multi-user chats, but that's beyond the scope of this subscriptions example
 */
  author: Scalars['String'],
  to: Scalars['String'],
  text: Scalars['String'],
  createdAt: Scalars['DateTime'],
}

export interface Mutation {
   __typename?: 'Mutation',
  /** 
 * Change the password for the user's account. Upon success, all existing
   * sessions will be invalidated and a new session ID will be returned that can
   * be used to replace the user's now invalidated session.
   * 
   * *Rate limited.*
 */
  changePassword: ChangePasswordResponse,
  /** 
 * Login with a username and password. Upon success, returns a session ID.
   * 
   * *Rate limited.*
 */
  login: LoginResponse,
  /** 
 * Create a new account. Password may be omitted to require the user to set it during activation.
   * 
   * *Rate limited.*
 */
  register: RegisterResponse,
  /** 
 * Start password restoration. Upon success, This will send an email with a
   * link that can be used to set a new password.
   * 
   * *Rate limited.*
 */
  restorePassword: RestorePassswordResponse,
  /** 
 * Send a message to the provided person.
   * 
   * *Rate limited.*
 */
  sendMessage: SendMessageResponse,
}


export interface MutationChangePasswordArgs {
  currentPassword: Scalars['String'],
  newPassword: Scalars['String']
}


export interface MutationLoginArgs {
  username: Scalars['String'],
  password: Scalars['String']
}


export interface MutationRegisterArgs {
  email: Scalars['String'],
  password?: Maybe<Scalars['String']>
}


export interface MutationRestorePasswordArgs {
  username: Scalars['String']
}


export interface MutationSendMessageArgs {
  to: Scalars['String'],
  text: Scalars['String']
}

export enum RegisterError {
  /** The provided email is incorrectly formatted. It should be a valid email address. */
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_ALREADY_USED = 'EMAIL_ALREADY_USED',
  UNSAFE_PASSWORD = 'UNSAFE_PASSWORD'
}

export interface RegisterResponse {
   __typename?: 'RegisterResponse',
  account?: Maybe<Account>,
  error?: Maybe<RegisterError>,
}

export enum RestorePassswordError {
  INVALID_USERNAME = 'INVALID_USERNAME'
}

export interface RestorePassswordResponse {
   __typename?: 'RestorePassswordResponse',
  error?: Maybe<RestorePassswordError>,
}

export enum SendMessageError {
  /** Currently only has fatal errors */
  UNDEFINED = '_UNDEFINED_'
}

export interface SendMessageResponse {
   __typename?: 'SendMessageResponse',
  error?: Maybe<SendMessageError>,
}


export interface Subscription {
   __typename?: 'Subscription',
  message: Message,
}
