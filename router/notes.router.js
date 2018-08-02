'use strict';

const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');  // <<== add this
const notes = simDB.initialize(data);

//GET all and search by query
router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm)
    .then(list => {
      if(list) {
        res.json(list);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });

});
//GET single with params
router.get('/notes/:id', (req, res, next) => {
  const { id } = req.params;
  //+++++++++++++++++++++++++++++++++++++
  notes.find(id)
    .then(item => {
      if(item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });

  // notes.find(id, (err, item) => {
  //   if (err) {
  //     return next(err); // goes to error handler
  //   }
  //   res.json(item); //responds with filtered array
});
//++++++++++++++++++++++++++++++++

// PUT update an item
router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.update(id, updateObj)
    .then (item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// POST (insert) an item
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem)
    .then(newItem => {
      if (newItem) {
        res.location(`http://${req.headers.host}/api/notes/${newItem.id}`).status(201).json(newItem);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


// Delete an item
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  notes.delete(id)
    .then(id => {
      if (id) {
        res.sendStatus(204);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });

});

//+++++++++++++++++++++++

module.exports = router;




