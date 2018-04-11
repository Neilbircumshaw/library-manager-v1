const express = require("express");
const app = express();
const sequelize = require("../models").sequelize;
const Sequelize = require('sequelize');
const Book = require("../models").Book;
const Patron = require("../models").Patron;
const Loan = require("../models").Loan;
const bodyParser = require('body-parser');
const moment = require("moment");
const dateNow = moment().format('YYYY-MM-DD');
const returnBy = moment().add(7, 'days').format('YYYY-MM-DD');
const Op = Sequelize.Op
const router = express.Router();





router.get("/books/new", (req,res) => {
  let book = Book.build();
  res.render("new_book", { book: book});
});

router.post("/books/new", (req, res, next) => {
  Book.create(req.body)
    .then(book => {
    return res.redirect("/books/all");
    console.log(req.body);
  }).catch(function(err) {
        if(err.name === "SequelizeValidationError") {
          let book = Book.build(req.body);
          console.log(err.errors[0])
          res.render("new_book", {errors: err.errors, book: book});
        }
      });});


/* Book.finaAll() will go through the whole database and find every piece of data. All this data is then put into the
variable "results". results is then assigned to the variable "Book" which is passed through the render methord to the "all_Book" route.
In the "all_Book" pug template each iteration of stored data is looped over with "each book in Book" (Book is refering to the varible which is passed in below.
) Each piece of table data in the table in the pug template then injects the "title" with book.title, the "author" with book.author, the "genre" with book.genre and
the "first_published" with book.first_published to display all the data from the database*/

router.get("/books/all", (req, res, next) => {
  Book.findAll()
    .then(results => {
      res.render("all_books", {books: results});
  }).catch(err => next(err))
});


router.get("/books/checked_out", (req,res) => {
  Loan.findAll({
         where:{returned_on: null},
         include: [Book, Patron]
      })
    .then(results => {
  res.render("checked_books", {loans:results});
}).catch(err => next(err))
});


router.get("/books/overdue", (req,res, next) => {
  Loan.findAll(
    {
     include: [Book, Patron],
     where: {
       returned_on: null,
       return_by:  {[Op.lt]: dateNow}
       }
    }
  ).then(results => {
  res.render("overdue_books", {loans: results});
}).catch(err => next(err))
});



/*so the varible paramater in the URL "id" will equal a number corresponding to the id of one of the Book in the database. I passed this id number
in the all_Book route, like this: /Book/details/'+book.id. I then used on the Book module the findOne methord to find a match
 where the id of the book matches the id of the route(req.params.id will grab that :id paramater, this being a number).
 this result is then passed as an argument I called "result", which is then
 passed as a varible called "book" to the book_details route.*/

router.get("/books/details/:id", (req, res, next) => {
  Book.findOne({
    where: {id: req.params.id},
  }).then(results => {
  Loan.findAll({
    where: {book_id: req.params.id},
    include: [Book, Patron]
  }).then(loan =>{
    res.render("book_details", {book: results, loans: loan})
  }).catch((err)=>next(err))
})});


router.post("/books/details/:id", (req, res ,next) => {
   Book.findOne({
     where: { id: req.params.id}
   }).then(book => {
     return book.update(req.body);

   }).then(loan => {
    return res.redirect("/books/all")
   })

})


router.get("/books/returned/:id", (req, res, next) => {
  Loan.findOne({
     where: { id: req.params.id },
     include: [Book, Patron]
   }).then(results => {
      res.render('return_book', { loan: results, returnDate: dateNow });
  });
});

router.post("/books/returned/:id", (req, res ,next) => {
   Loan.findOne({
     where: { id: req.params.id}
   }).then(loan => {
     return loan.update(req.body);

   }).then(loan => {
    return res.redirect("/loans/all")
   })

})

module.exports = router;
