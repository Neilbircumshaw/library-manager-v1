const express = require("express");
const app = express();
const sequelize = require("./models").sequelize;
const books = require("./models").books;
const patrons = require("./models").patrons;
const loans = require("./models").loans;
const bodyParser = require('body-parser');
const moment = require("moment");




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

sequelize.sync().then(function(){
app.listen(3000);
});

app.set("view engine", "pug");

app.get("/", (req,res) => {
  res.render("home");
});

app.get("/books/new", (req,res) => {
  res.render("new_book");
});

app.post("/books/new", (req, res, next) => {
  books.create(req.body)
    .then(book => {
    return res.redirect("/books/all");
    console.log(req.body);
  })});



/* books.finaAll() will go through the whole database and find every piece of data. All this data is then put into the
variable "results". results is then assigned to the variable "books" which is passed through the render methord to the "all_books" route.
In the "all_books" pug template each iteration of stored data is looped over with "each book in books" (books is refering to the varible which is passed in below.
) Each piece of table data in the table in the pug template then injects the "title" with book.title, the "author" with book.author, the "genre" with book.genre and
the "first_published" with book.first_published to display all the data from the database*/

app.get("/books/all", (req, res, next) => {
  books.findAll()
    .then(results => {
      res.render("all_books", {books: results});
  }).catch(err => next(err))
});





app.get("/books/overdue", (req,res) => {
  res.render("overdue_books");
});

app.get("/books/checked_out", (req,res) => {
  res.render("checked_books");
});


/*so the varible paramater in the URL "id" will equal a number corresponding to the id of one of the books in the database. I passed this id number
in the all_books route, like this: /books/details/'+book.id. I then used on the books module the findOne methord to find a match
 where the id of the book matches the id of the route(req.params.id will grab that :id paramater, this being a number).
 this result is then passed as an argument I called "result", which is then
 passed as a varible called "book" to the book_details route.*/

app.get("/books/details/:id", (req, res, next) => {
  books.findOne({
    where: {
      id: req.params.id
    }
  }).then(result => {
    res.render("book_details", {book: result})
  }).catch((err)=>next(err))
});


app.get("/books/details", (req,res) => {
  res.render("book_details");
});

app.get("/books/returned", (req,res) => {
  res.render("return_book");
});

app.get("/patrons/new", (req,res) => {
  res.render("new_patron");
});

app.post("/patrons/new", (req, res, next) => {
  patrons.create(req.body)
    .then(patron => {
    return res.redirect("/patrons/all");
  })});





app.get("/patrons/all", (req, res, next) => {
  patrons.findAll()
    .then(results => {
      res.render("all_patrons", {patrons: results});
  }).catch(err => next(err))
});

app.get("/patrons/details", (req,res) => {
  res.render("patron_details");
});

app.get("/loan/new", (req, res, next) => {
    books.findAll()
    .then(books => {
      patrons.findAll().then(patrons => {
        const dateNow = moment().format('YYYY-MM-DD');
        const returnBy = moment().add(7, 'days').format('YYYY-MM-DD');
        return res.render("new_loan", {books, patrons, loaned_on: dateNow, return_by: returnBy})
      }).catch(err => next(err))
    }).catch(err => next(err))
});


app.post("/loan/new", (req, res, next) => {
  loans.create(req.body)
    .then(loan => {
    return res.redirect("/loan/all");
  })});



app.get('/loan/all', (req, res, next) => {
	loans.findAll({include: [
        {model: patrons},
        {model: books}
      ]})
    .then(results => {
      res.render("all_loans", {loans: results});
  }).catch(err => next(err))
});



app.get("/loan/overdue_loans", (req,res) => {
  res.render("overdue_loans");
});

app.get("/loan/checked_loans", (req,res) => {
  res.render("checked_loans");
});

app.use(express.static("public"));
