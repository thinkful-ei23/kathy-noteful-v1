'use strict';

const express = require('express');
const morgan = require('morgan');


const { PORT } = require('./config');
const notesRouter = require('./router/notes.router');


// create EXPRESS app
const app = express();

//logs all requests
app.use(morgan('dev'));

//static file server
app.use(express.static('public'));

//parse request body
app.use(express.json());

// mount the router
app.use('/api', notesRouter);


app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
  //res.status(404).json({ message: 'Not Found' });
});

// Catch-all error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});
//++++++++++++++++++++++++++++++++++++++++++
//listen for incoming connections
if (require.main === module) {
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app; //export for testing