import { FetchResult } from 'apollo-link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function requireData<TData extends any>(
  promise: Promise<FetchResult<TData>>,
): Promise<
  // errors would be pointless as we already throw when they have a value
  Omit<FetchResult<TData>, 'errors'> & {
    data: TData
  }
> {
  const { data, errors, ...others } = await promise
  if (errors && errors[0]) {
    throw errors[0]
  }
  if (!data) {
    throw new Error('Received no data')
  }
  return {
    data,
    ...others,
  }
}
