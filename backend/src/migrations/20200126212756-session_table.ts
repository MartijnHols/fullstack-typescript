import { DataTypes, QueryInterface } from 'sequelize'

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('Session', {
    uniqueId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Account',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  })
}

export function down(queryInterface: QueryInterface) {
  return queryInterface.dropTable('Session')
}
