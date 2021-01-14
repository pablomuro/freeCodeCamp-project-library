/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require("../db/BookModel");

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      const books = await Book.find().exec()
      res.json(books)
    })

    .post(async function (req, res) {
      let title = req.body.title;
      const book = new Book({ title });
      if (book.validateSync()) {
        return res.send('missing required field title');
      }

      try {
        let newBook = await book.save();
        return res.json(newBook.toObject())
      } catch (error) {
        return res.json(error);
      }
    })

    .delete(async function (req, res) {
      try {
        const book = await Book.deleteMany({}).exec()
        return res.send('complete delete successful')
      } catch (error) {
        return res.send('no book exists')
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      try {
        let bookId = req.params.id;
        const book = await Book.findById(bookId).exec()
        return res.json(book.toObject())
      } catch (error) {
        return res.send('no book exists')
      }
    })

    .post(async function (req, res) {
      let bookId = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send('missing required field comment')
      }

      try {
        const book = await Book.findById(bookId).exec()
        book.comments.push(comment)
        await book.save()
        return res.json(book.toObject())
      } catch (error) {
        return res.send('no book exists')
      }


    })

    .delete(async function (req, res) {
      try {
        let bookId = req.params.id;
        const book = await Book.findOneAndDelete({ _id: bookId }).exec()
        if (book) {
          return res.send('delete successful')
        } else {
          throw new Error('error')
        }
      } catch (error) {
        // console.log(error)
        return res.send('no book exists')
      }
    });

};
