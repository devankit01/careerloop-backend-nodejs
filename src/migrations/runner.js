const fs = require('fs');
const path = require('path');

/**
 * Run all migrations in the migrations directory
 */
async function runMigrations() {
  try {
    console.log('Running migrations...');
    
    // Get all migration files
    const migrationFiles = fs.readdirSync(__dirname)
      .filter(file => {
        return (
          file.indexOf('.') !== 0 &&
          file !== 'runner.js' &&
          file.slice(-3) === '.js'
        );
      })
      .sort();
    
    console.log(`Found ${migrationFiles.length} migration files`);
    
    // Run each migration
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      
      const migration = require(path.join(__dirname, file));
      await migration.up();
      
      console.log(`Completed migration: ${file}`);
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

module.exports = runMigrations; 