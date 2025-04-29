import { sequelize } from '../models';

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Connection established successfully.');

    await sequelize.sync({ force: true });
    console.log('Database schema synchronized.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate();
