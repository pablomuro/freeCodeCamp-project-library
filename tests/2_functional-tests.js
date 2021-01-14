/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require("../db/BookModel");

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'New Book' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'comments', 'Books should contain comments');
            assert.property(res.body, 'title', 'Books should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title', 'response should be an error message');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {
      let bookOnDb;
      setup((done) => {
        const book = new Book({ title: 'Book to Delete' });
        book.save((error, book) => {
          if (error) console.log(error)
          bookOnDb = book
          done();
        })
      });

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/wrongId')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'response should be an error message');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get(`/api/books/${bookOnDb._id}`)
          .end(function (err, res) {
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'comments', 'Books should contain comments');
            assert.isArray(res.body.comments, 'comments should be an array');
            assert.property(res.body, 'title', 'Books should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {
      let bookOnDb;
      setup((done) => {
        const book = new Book({ title: 'Book to Delete' });
        book.save((error, book) => {
          if (error) console.log(error)
          bookOnDb = book
          done();
        })
      });

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post(`/api/books/${bookOnDb._id}`)
          .send({ comment: 'test comment' })
          .end(function (err, res) {
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Books should contain title');
            assert.property(res.body, '_id', 'Books should contain _id');
            assert.property(res.body, 'comments', 'Books should contain comments');
            assert.isArray(res.body.comments, 'comments should be an array');
            assert.equal(res.body.comments.length, 1, 'comments length must be one')
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post('/api/books/wrongId')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment', 'response should be an error message');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post('/api/books/wrongId')
          .send({ comment: 'test comment' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'response should be an error message');
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {
      let bookOnDb;
      setup((done) => {
        // const book = new Book({ title: 'Book to Delete' });
        // book.save((error, book) => {
        //   if (error) console.log(error)
        //   bookOnDb = book
        //   done();
        // })
        chai.request(server)
          .post(`/api/books/`)
          .send({ title: 'Book to Delete' })
          .end(function (err, res) {
            bookOnDb = res.body
            done();
          });
      });

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete(`/api/books/${bookOnDb._id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful', 'response should be an success message');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete('/api/books/6f665eb46e296f6b9b6a504d')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'response should be an error message');
            done();
          });
      });

    });

  });

});
