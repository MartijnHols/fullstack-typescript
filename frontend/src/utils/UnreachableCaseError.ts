// Source: https://stackoverflow.com/a/52913382/684353

export default class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`)
  }
}
