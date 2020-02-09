import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { default  as AccountModel } from './models/Account';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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
  newSessionId: Maybe<Scalars['SessionID']>,
  error: Maybe<ChangePasswordError>,
}


export enum LoginError {
  INVALID_USERNAME = 'INVALID_USERNAME',
  ACCOUNT_UNAVAILABLE = 'ACCOUNT_UNAVAILABLE',
  INVALID_PASSWORD = 'INVALID_PASSWORD'
}

export interface LoginResponse {
   __typename?: 'LoginResponse',
  sessionId: Maybe<Scalars['SessionID']>,
  error: Maybe<LoginError>,
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
  password: Maybe<Scalars['String']>
}


export interface MutationRestorePasswordArgs {
  username: Scalars['String']
}

export enum RegisterError {
  /** The provided email is incorrectly formatted. It should be a valid email address. */
  INVALID_EMAIL = 'INVALID_EMAIL',
  EMAIL_ALREADY_USED = 'EMAIL_ALREADY_USED',
  UNSAFE_PASSWORD = 'UNSAFE_PASSWORD'
}

export interface RegisterResponse {
   __typename?: 'RegisterResponse',
  account: Maybe<Account>,
  error: Maybe<RegisterError>,
}

export enum RestorePassswordError {
  INVALID_USERNAME = 'INVALID_USERNAME'
}

export interface RestorePassswordResponse {
   __typename?: 'RestorePassswordResponse',
  error: Maybe<RestorePassswordError>,
}




export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type isTypeOfResolverFn = (obj: any, info: GraphQLResolveInfo) => boolean;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Mutation: ResolverTypeWrapper<{}>,
  String: ResolverTypeWrapper<Scalars['String']>,
  ChangePasswordResponse: ResolverTypeWrapper<ChangePasswordResponse>,
  SessionID: ResolverTypeWrapper<Scalars['SessionID']>,
  ChangePasswordError: ChangePasswordError,
  LoginResponse: ResolverTypeWrapper<LoginResponse>,
  LoginError: LoginError,
  RegisterResponse: ResolverTypeWrapper<Omit<RegisterResponse, 'account'> & { account: Maybe<ResolversTypes['Account']> }>,
  Account: ResolverTypeWrapper<AccountModel>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  RegisterError: RegisterError,
  RestorePassswordResponse: ResolverTypeWrapper<RestorePassswordResponse>,
  RestorePassswordError: RestorePassswordError,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Mutation: {},
  String: Scalars['String'],
  ChangePasswordResponse: ChangePasswordResponse,
  SessionID: Scalars['SessionID'],
  ChangePasswordError: ChangePasswordError,
  LoginResponse: LoginResponse,
  LoginError: LoginError,
  RegisterResponse: Omit<RegisterResponse, 'account'> & { account: Maybe<ResolversParentTypes['Account']> },
  Account: AccountModel,
  ID: Scalars['ID'],
  Boolean: Scalars['Boolean'],
  DateTime: Scalars['DateTime'],
  RegisterError: RegisterError,
  RestorePassswordResponse: RestorePassswordResponse,
  RestorePassswordError: RestorePassswordError,
};

export type AccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  verified: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  lastSeenAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  canLogin: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type ChangePasswordResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChangePasswordResponse'] = ResolversParentTypes['ChangePasswordResponse']> = {
  newSessionId: Resolver<Maybe<ResolversTypes['SessionID']>, ParentType, ContextType>,
  error: Resolver<Maybe<ResolversTypes['ChangePasswordError']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = {
  sessionId: Resolver<Maybe<ResolversTypes['SessionID']>, ParentType, ContextType>,
  error: Resolver<Maybe<ResolversTypes['LoginError']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changePassword: Resolver<ResolversTypes['ChangePasswordResponse'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'currentPassword' | 'newPassword'>>,
  login: Resolver<ResolversTypes['LoginResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'username' | 'password'>>,
  register: Resolver<ResolversTypes['RegisterResponse'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'email'>>,
  restorePassword: Resolver<ResolversTypes['RestorePassswordResponse'], ParentType, ContextType, RequireFields<MutationRestorePasswordArgs, 'username'>>,
};

export type RegisterResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegisterResponse'] = ResolversParentTypes['RegisterResponse']> = {
  account: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>,
  error: Resolver<Maybe<ResolversTypes['RegisterError']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type RestorePassswordResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RestorePassswordResponse'] = ResolversParentTypes['RestorePassswordResponse']> = {
  error: Resolver<Maybe<ResolversTypes['RestorePassswordError']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export interface SessionIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['SessionID'], any> {
  name: 'SessionID'
}

export type Resolvers<ContextType = any> = {
  Account: AccountResolvers<ContextType>,
  ChangePasswordResponse: ChangePasswordResponseResolvers<ContextType>,
  DateTime: GraphQLScalarType,
  LoginResponse: LoginResponseResolvers<ContextType>,
  Mutation: MutationResolvers<ContextType>,
  RegisterResponse: RegisterResponseResolvers<ContextType>,
  RestorePassswordResponse: RestorePassswordResponseResolvers<ContextType>,
  SessionID: GraphQLScalarType,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
