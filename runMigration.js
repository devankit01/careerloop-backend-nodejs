const jobStatusTrackMigration = require('./src/migrations/create_job_status_track');

jobStatusTrackMigration.up()
  .then(() => {
    console.log(' Migration complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error(' Migration failed:', err);
    process.exit(1);
  });