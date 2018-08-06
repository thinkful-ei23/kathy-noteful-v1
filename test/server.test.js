'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

//////////////////////////
describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });
});
//////////////////////////

describe('Noteful App', function () {

  let server;
  before(function () {
    return app.startServer()
      .then(instance => server = instance);
  });

  after(function () {
    return server.stopServer();
  });
});
//////////////////////////
describe('Static static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});
//////////////////////////
describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});
//////////////////////////
describe('GET /api/notes', function () {

  it('should return the default of 10 notes as an array', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
      });
  });

  it('should return an array of objects with the id, title and content', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
        res.body.forEach(function (item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys('id', 'title', 'content');
        });
      });
  });

  it('should return correct search results for a valid query', function () {
    return chai.request(app)
      .get('/api/notes?searchTerm=about%20cats')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(4);
        expect(res.body[0]).to.be.an('object');
      });
  });

  it('should return an empty array for an incorrect query', function () {
    return chai.request(app)
      .get('/api/notes?searchTerm=Not%20a%20Valid%20Search')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(0);
      });
  });
});
//end of describe ('GET /api/notes',

describe('GET /api/notes/:id', function () {
  it('should return correct note object with id, title and content for a given id', function () {
    return chai.request(app)
      .get('/api/notes/1005')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1005);
        expect(res.body.title).to.equal('10 ways cats can help you live to 100');
      });
  });
  it('should respond with a 404 for an invalid id', function () {
    return chai.request(app)
      .get('/api/notes/DOESNOTEXIST')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
  // end of describe GET api/notes/:id
});

describe('POST /api/notes', function () {

  it('should create and return a new item when provided valid data', function () {
    const newItem = {
      'title': 'The best article about cats ever!',
      'content': 'Lots of stuff...'
    };
    return chai.request(app)
      .post('/api/notes')
      .send(newItem)
      .then(function (res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');

        expect(res.body.id).to.equal(1010);
        expect(res.body.title).to.equal(newItem.title);
        expect(res.body.content).to.equal(newItem.content);
        expect(res).to.have.header('location');
      });
  });
/*
  it('should return an error when missing "title" field', function () {
    const newItem = {
      'title': '', 'content': 'bar'
    };
    return chai.request(app)
      .post('/api/notes')
      .send(newItem)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
        //expect(res.body).to.include.keys('message', 'error');
        //expect(res.body.error.status).to.equal(400);
      });
	});
	*/



// end of describe POST api/notes/
});
describe('PUT /api/notes/:id', function () {

  it('should update the note', function () {
    const updateItem = {
      'title': 'What about dogs?!',
      'content': 'woof woof'
    };
    return chai.request(app)
      .put('/api/notes/1005')
      .send(updateItem)
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');

        expect(res.body.id).to.equal(1005);
        expect(res.body.title).to.equal(updateItem.title);
        expect(res.body.content).to.equal(updateItem.content);
      });
  });

  it('should respond with a 404 for an invalid id', function () {
    const updateItem = {
      'title': 'What about dogs?!',
      'content': 'woof woof'
    };
    return chai.request(app)
      .put('/api/notes/DOESNOTEXIST')
      .send(updateItem)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
/*
  it('should return an error when missing "title" field', function () {
    const updateItem = {
      'title': '', 'content': 'What now?!?!'
    };
    return chai.request(app)
      .put('/api/notes')
      .send(updateItem)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
*/
});

describe('DELETE  /api/notes/:id', function () {

  it('should delete an item by id', function () {
    return chai.request(app)
      .delete('/api/notes/1005')
      .then(function (res) {
        expect(res).to.have.status(204);
      });
  });

});




