import { ApolloError } from 'apollo-server-express'
import { GraphQLResolveInfo } from 'graphql'

import { ApolloServerContext } from '../createApolloServer'

const authenticated = <
  Root extends object = {},
  Args extends object = {},
  Context extends ApolloServerContext = ApolloServerContext,
  Info extends GraphQLResolveInfo = GraphQLResolveInfo,
  Response extends any = any
>(
  next: (
    root: Root,
    args: Args,
    context: Context & Required<Pick<Context, 'session'>>,
    info: Info,
  ) => Response,
) => (root: Root, args: Args, context: Context, info: Info): Response => {
  if (!context.session) {
    throw new ApolloError(
      'You need to be authenticated to use this endpoint.',
      'UNAUTHENTICATED',
    )
  }

  return next(
    root,
    args,
    context as Context & Required<Pick<Context, 'session'>>,
    info,
  )
}

export default authenticated
