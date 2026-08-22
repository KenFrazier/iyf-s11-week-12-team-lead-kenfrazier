require('dotenv').config();

// Validate required environment variables
const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`Error: ${varName} environment variable is required`);
    process.exit(1);
  }
}

const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require('./src/config');

connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
}).catch((err) => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});
