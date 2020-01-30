import { DataTypes } from 'sequelize'
import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript'
import generateUniqueId from 'uuid/v4'

import Account from './Account'

@Table
class Session extends Model<Session> {
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: generateUniqueId,
  })
  uniqueId!: string
  @Column({
    type: DataTypes.NUMBER,
    allowNull: false,
  })
  @ForeignKey(() => Account)
  accountId!: number
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  })
  createdAt!: Date
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  })
  lastSeenAt!: Date

  @BelongsTo(() => Account)
  account!: Account
}

export default Session
