const express = require('express');
const dotenv = require('dotenv');
const makets = require('./routes/makets');
dotenv.config({ path: './config/config.env' });
const app = express();

app.use(express.json());
app.use('/api/v1/makets', makets);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
