import { ExecutionResult } from '@apollo/react-common'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function guaranteeResult<TData extends any = any>(
  promise: Promise<ExecutionResult<TData>>,
) {
  const { data, errors, ...others } = await promise
  if (errors && errors[0]) {
    throw errors[0]
  }
  if (!data) {
    throw new Error('Received no data')
  }
  return {
    data,
    errors,
    ...others,
  }
}
