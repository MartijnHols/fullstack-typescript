export const MIN_PASSWORD_LENGTH = 6

export default function isPasswordValid(password: string) {
  return password.length > MIN_PASSWORD_LENGTH
}
