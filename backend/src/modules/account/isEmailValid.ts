import validator from 'validator'

export default function isEmailValid(email: string) {
  return validator.isEmail(email)
}
