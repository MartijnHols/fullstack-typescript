import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
export type Maybe<T> = T | null
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X]
} &
  { [P in K]-?: NonNullable<T[P]> }
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
   * Expected errors: no-account, invalid-password, unsafe-password
   * Rate limited.
   */
  changePassword: Scalars['SessionID']
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
  register: Account
}

export interface MutationChangePasswordArgs {
  username: Scalars['String']
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

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type Resolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> = ResolverFn<TResult, TParent, TContext, TArgs>

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes>

export type isTypeOfResolverFn = (obj: any, info: GraphQLResolveInfo) => boolean

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Mutation: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']>
  SessionID: ResolverTypeWrapper<Scalars['SessionID']>
  LoginResponse: ResolverTypeWrapper<LoginResponse>
  LoginError: LoginError
  Account: ResolverTypeWrapper<Account>
  ID: ResolverTypeWrapper<Scalars['ID']>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Mutation: {}
  String: Scalars['String']
  SessionID: Scalars['SessionID']
  LoginResponse: LoginResponse
  LoginError: LoginError
  Account: Account
  ID: Scalars['ID']
  Boolean: Scalars['Boolean']
  DateTime: Scalars['DateTime']
}

export type AccountResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']
> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>
  verified: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  lastSeenAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type LoginResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']
> = {
  sessionId: Resolver<
    Maybe<ResolversTypes['SessionID']>,
    ParentType,
    ContextType
  >
  error: Resolver<Maybe<ResolversTypes['LoginError']>, ParentType, ContextType>
  __isTypeOf?: isTypeOfResolverFn
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  changePassword: Resolver<
    ResolversTypes['SessionID'],
    ParentType,
    ContextType,
    RequireFields<
      MutationChangePasswordArgs,
      'username' | 'currentPassword' | 'newPassword'
    >
  >
  login: Resolver<
    ResolversTypes['LoginResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'username' | 'password'>
  >
  register: Resolver<
    ResolversTypes['Account'],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterArgs, 'username'>
  >
}

export interface SessionIdScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['SessionID'], any> {
  name: 'SessionID'
}

export type Resolvers<ContextType = any> = {
  Account: AccountResolvers<ContextType>
  DateTime: GraphQLScalarType
  LoginResponse: LoginResponseResolvers<ContextType>
  Mutation: MutationResolvers<ContextType>
  SessionID: GraphQLScalarType
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
