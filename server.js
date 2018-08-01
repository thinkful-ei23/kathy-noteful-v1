'use strict';
// create EXPRESS app
const express = require('express');
const requestLogger = require('./middleware/logger');

const app = express();
//logs all requests
app.use(requestLogger);
//static file server
app.use(express.static('public'));
//parse request body
app.use(express.json());

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this


//console.log('Hello Noteful!');


//++++++++++++++++++++++++++++++++++++++++++

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list)  => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); //responds with filtered array

  });
});

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;

  notes.find(id, (err, item) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(item); //responds with filtered array
  });

  // const id  = req.params.id;
  // const findObjByMatchId = data.find(item => item.id === Number(id));
  // res.json(findObjByMatchId);
});

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

//++++++++++++++++++++++++++++++++++++++++++
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});
//++++++++++++++++++++++++++++++++++++++++++

app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


// if(searchTerm) {
//   //console.log(searchBy); // test for searchTerm in server console
//   const find = data.filter(note => note.title.includes(searchTerm) || note.content.includes(searchTerm));
//   //console.log(find);
//   res.json(find);
// } else {
//   res.json(data);
// }
