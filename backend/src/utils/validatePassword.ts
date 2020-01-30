import bcrypt from 'bcrypt'

export default function validatePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
