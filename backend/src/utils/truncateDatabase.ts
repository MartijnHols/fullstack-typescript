import sequelize from '../sequelize'
import models from '../models'

export default async function truncateDatabase() {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true })
  await Promise.all(
    models.map(model => model.destroy({ where: {}, force: true })),
  )
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true })
}
