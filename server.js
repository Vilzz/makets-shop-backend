const express = require('express');
const dotenv = require('dotenv');
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');
const makets = require('./routes/makets');
dotenv.config({ path: './config/config.env' });
const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, './logs/access.log'),
  {
    flags: 'a'
  }
);
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());
app.use('/api/v1/makets', makets);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
