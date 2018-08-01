'use strict';

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

// GET Notes with search
notes.filter('cats', (err, list) => {
  if (err) {
    console.error(err);
  }
  console.log(list);
});

// GET Notes by ID
notes.find(1005, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// PUT (Update) Notes by ID
const updateObj = {
  title: 'New Title',
  content: 'Blah blah blah'
};

notes.update(1005, updateObj, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// POST (Create) New Note
const createObj = {
  title: 'title',
  content: 'content'
};

// POST http://local.com/item/35
/*
notes.post('/db/notes.json',​ ​(req,​ ​res)​ ​=>​ ​{
  ​ ​​ ​res.location('http://localhost:8080/'); ​ ​​ ​
    res.status(201).send(newItem);
  });

notes.create(createObj, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found, at least not with a teapot');
  }
});

// DELETE
notes.delete('/',​ ​(req,​ ​res)​ ​=>​ ​{ ​ ​​ ​
  res.sendStatus(204);
});

*/