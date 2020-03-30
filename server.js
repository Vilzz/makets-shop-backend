const express = require('express');
const dotenv = require('dotenv');
//const fs = require('fs');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');
const path = require('path');
const makets = require('./routes/makets');
dotenv.config({ path: './config/config.env' });
const app = express();

const accessLogStream = rfs.createStream('access.log', {
  size: '10M',
  interval: '1d',
  compress: 'gzip',
  path: path.join(__dirname, './logs')
});
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());
app.use('/api/v1/makets', makets);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
