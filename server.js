'use strict';
// INSERT EXPRESS APP CODE HERE...ls
const express = require('express');
// Load array of notes
const data = require('./db/notes');

const requestLogger = require('./middleware/logger');




console.log('Hello Noteful!');



const app = express();

app.use(requestLogger)
//static file server
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  if(searchTerm) {
    //console.log(searchBy); // test for searchTerm in server console
    const find = data.filter(note => note.title.includes(searchTerm) || note.content.includes(searchTerm));
    //console.log(find);
    res.json(find);
  } else {
    res.json(data);
  }

});

app.get('/api/notes/:id', (req, res) => {
  const id  = req.params.id;
  const findObjByMatchId = data.find(item => item.id === Number(id));
  res.json(findObjByMatchId);
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});


//const { PORT }  = require('./config');

app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

