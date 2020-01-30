import { DataTypes, QueryInterface } from 'sequelize'

export function up(queryInterface: QueryInterface) {
  return queryInterface.createTable('Account', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      // Can be NULL to make the setting of a password part of the verification
      // link.
      allowNull: true,
    },
    verified: {
      // Sometimes we do want to make password a part of the registration form,
      // in that case we need a separate indicator if the account was verified.
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    // TODO: Remove and track login history in a separate table
    lastSeenAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  })
}

export function down(queryInterface: QueryInterface) {
  return queryInterface.dropTable('Account')
}
