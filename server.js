const express = require('express');
const dotenv = require('dotenv');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();

const makets = require('./routes/makets');
const category = require('./routes/category');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Logging middleware
const accessLogStream = rfs.createStream('access.log', {
  size: '10M',
  interval: '1d',
  compress: 'gzip',
  path: path.join(__dirname, './logs'),
});
app.use(
  morgan('combined', {
    stream: accessLogStream,
  })
);
app.use(express.json());
app.use(fileupload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/makets', makets);
app.use('/api/v1/category', category);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
