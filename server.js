const mongoose = require('mongoose');
const app = require('./app');
const { PORT, MONGO_URL } = require('./utils/config');
const { getJwtSecret } = require('./utils/jwt');

getJwtSecret();

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listen port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
