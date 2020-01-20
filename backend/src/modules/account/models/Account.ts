// Account is separate from the rest of the user properties to keep things pure.
// Account should only be necessary during login, creation, password recovery,
// and perhaps to show if a user has an account. The email may be used for
// contact info.
//
// Account can be deleted entirely for GDPR requests. The reason for storing
// this data is to provide an authentication mechanism. The email can also be
// used to identify and contact the person.
// This might change when we have a separate table keeping track of successful
// logins; keeping this data might become essential to comply with data leakage
// laws as it is necessary to identify the scope of a data leak and inform
// affected users should our login be compromised.

import { DataTypes } from 'sequelize'
import { Table, Column, Model } from 'sequelize-typescript'
import bcrypt from 'bcrypt'

import sequelize from '../../../sequelize'

const SALT_ROUNDS = 10

@Table
class Account extends Model<Account> {
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string
  @Column({
    type: DataTypes.STRING,
    // Can be undefined to make the setting of a password part of the verification
    // link.
    allowNull: true,
    validate: {
      // If undefined represents "no password set", then everything else
      // represents "password set". An empty string is not a valid password
      // hash.
      notEmpty: true,
    },
  })
  private passwordHash!: string | null
  // If password is a part of the registration form, we need a separate
  // indicator whether the account is verified.
  @Column({
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  verified!: boolean

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  })
  createdAt!: Date
  // TODO: Remove and track login history in a separate table
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  })
  lastSeenAt!: Date

  async setPassword(value: string) {
    this.passwordHash = await bcrypt.hash(value, SALT_ROUNDS)
  }
  validatePassword(value: string) {
    if (!this.passwordHash) {
      throw new Error('User has no password and can not login yet')
    }

    return bcrypt.compare(value, this.passwordHash)
  }
}

sequelize.addModels([Account])

export default Account
