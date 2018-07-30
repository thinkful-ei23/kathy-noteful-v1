'use strict';

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const app = express();
//static file server
app.use(express.static('public'));

app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

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

