import { ApolloError } from 'apollo-server-express'

async function makeResponse<
  ResponseFormat extends { [key: string]: PromiseResult } & {
    error: string | null
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PromiseResult extends any = any
>(
  promise: Promise<PromiseResult>,
  fieldName: keyof ResponseFormat,
): Promise<ResponseFormat>
async function makeResponse<
  ResponseFormat extends {
    error: string | null
  }
>(promise: Promise<void>): Promise<ResponseFormat>

async function makeResponse<
  ResponseFormat extends {
    error: string | null
  } & ({ [key: string]: PromiseResult } | {}),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PromiseResult extends any = any
>(
  promise: Promise<PromiseResult>,
  fieldName?: keyof ResponseFormat,
): Promise<ResponseFormat> {
  try {
    const result = await promise
    return {
      ...(fieldName
        ? {
            [fieldName]: result,
          }
        : {}),
      error: null,
    } as ResponseFormat
  } catch (err) {
    if (err instanceof ApolloError) {
      return {
        ...(fieldName
          ? {
              [fieldName]: null,
            }
          : {}),
        error: err.extensions.code,
      } as ResponseFormat
    } else {
      throw err
    }
  }
}

export default makeResponse
