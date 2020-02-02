import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export default function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS)
}
