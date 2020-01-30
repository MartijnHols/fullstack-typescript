import truncateDatabase from './truncateDatabase'

export default function setupDatabaseTests() {
  // Because of node's event loop, unlike in PHP, a transaction can't be set
  // globally. Having to pass it to every single nested query would be too
  // cumbersome.
  beforeEach(async () => {
    await truncateDatabase()
  })
}
