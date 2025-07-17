// start.js
const { startServer } = require('./server');

startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
