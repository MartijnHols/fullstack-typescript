declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toBeAJSONDateTime(): R
    }
  }
}

expect.extend({
  toBeAJSONDateTime(actual: string) {
    // This is a pretty specific test, but I believe it's necessary so we can
    // guarantee the result doesn't change when we upgrade Node or the DateTime
    // scalar. Clients may require this specific date format.
    const dateRegex = /^20[0-9][0-9]-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-6][0-9]:[0-6][0-9]\.[0-9]{3}Z$/
    return {
      pass: dateRegex.test(actual),
      message: () =>
        `Expected a date formatted like YYYY-MM-DDTHH:MM:SS.MMMZ. Received: ${actual}`,
    }
  },
})

// TS requires this to be a module
export default undefined
