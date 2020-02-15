import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string | number,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  DateTime: Date,
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
 * Send a message to the provided person.
   * 
   * *Rate limited.*
 */
  sendMessage: SendMessageResponse,
}


export interface MutationSendMessageArgs {
  to: Scalars['String'],
  text: Scalars['String']
}

export enum SendMessageError {
  /** Currently only has fatal errors */
  UNDEFINED = '_UNDEFINED_'
}

export interface SendMessageResponse {
   __typename?: 'SendMessageResponse',
  error: Maybe<SendMessageError>,
}

export interface Subscription {
   __typename?: 'Subscription',
  message: Message,
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
  SendMessageResponse: ResolverTypeWrapper<SendMessageResponse>,
  SendMessageError: SendMessageError,
  Subscription: ResolverTypeWrapper<{}>,
  Message: ResolverTypeWrapper<Message>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Mutation: {},
  String: Scalars['String'],
  SendMessageResponse: SendMessageResponse,
  SendMessageError: SendMessageError,
  Subscription: {},
  Message: Message,
  ID: Scalars['ID'],
  DateTime: Scalars['DateTime'],
  Boolean: Scalars['Boolean'],
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = {
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  author: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  to: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  text: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  sendMessage: Resolver<ResolversTypes['SendMessageResponse'], ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'to' | 'text'>>,
};

export type SendMessageResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendMessageResponse'] = ResolversParentTypes['SendMessageResponse']> = {
  error: Resolver<Maybe<ResolversTypes['SendMessageError']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  message: SubscriptionResolver<ResolversTypes['Message'], "message", ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  DateTime: GraphQLScalarType,
  Message: MessageResolvers<ContextType>,
  Mutation: MutationResolvers<ContextType>,
  SendMessageResponse: SendMessageResponseResolvers<ContextType>,
  Subscription: SubscriptionResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
