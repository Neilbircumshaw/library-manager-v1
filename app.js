const express = require("express");
const app = express();
const sequelize = require("./models").sequelize;
const Sequelize = require('sequelize');
const Book = require("./models").Book;
const Patron = require("./models").Patron;
const Loan = require("./models").Loan;
const bodyParser = require('body-parser');
const moment = require("moment");
const dateNow = moment().format('YYYY-MM-DD');
const returnBy = moment().add(7, 'days').format('YYYY-MM-DD');
const Op = Sequelize.Op





app.use(express.static("public"));


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
  Book.create(req.body)
    .then(book => {
    return res.redirect("/books/all");
    console.log(req.body);
  })});



/* Book.finaAll() will go through the whole database and find every piece of data. All this data is then put into the
variable "results". results is then assigned to the variable "Book" which is passed through the render methord to the "all_Book" route.
In the "all_Book" pug template each iteration of stored data is looped over with "each book in Book" (Book is refering to the varible which is passed in below.
) Each piece of table data in the table in the pug template then injects the "title" with book.title, the "author" with book.author, the "genre" with book.genre and
the "first_published" with book.first_published to display all the data from the database*/

app.get("/books/all", (req, res, next) => {
  Book.findAll()
    .then(results => {
      res.render("all_books", {books: results});
  }).catch(err => next(err))
});





app.get("/books/checked_out", (req,res) => {
  Loan.findAll({
         where:{returned_on: null},
         include: [Book, Patron]
      })
    .then(results => {
  res.render("checked_books", {loans:results});
}).catch(err => next(err))
});






app.get("/books/overdue", (req,res, next) => {
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

app.get("/books/details/:id", (req, res, next) => {
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


app.post("/books/details/:id", (req, res ,next) => {
   Book.findOne({
     where: { id: req.params.id}
   }).then(book => {
     return book.update(req.body);

   }).then(loan => {
    return res.redirect("/books/all")
   })

})






app.get("/books/returned/:id", (req, res, next) => {
  Loan.findOne({
     where: { id: req.params.id },
     include: [Book, Patron]
   }).then(results => {
      res.render('return_book', { loan: results, returnDate: dateNow });
  });
});

app.post("/books/returned/:id", (req, res ,next) => {
   Loan.findOne({
     where: { id: req.params.id}
   }).then(loan => {
     return loan.update(req.body);

   }).then(loan => {
    return res.redirect("/loans/all")
   })

})


app.get("/patrons/new", (req,res) => {
  res.render("new_patron");
});

app.post("/patrons/new", (req, res, next) => {
  Patron.create(req.body)
    .then(patron => {
    return res.redirect("/patrons/all");
  })});


app.get("/patrons/all", (req, res, next) => {
  Patron.findAll()
    .then(results => {
      res.render("all_patrons", {patrons: results});
  }).catch(err => next(err))
});






app.get("/patrons/details/:id", (req, res, next) => {
  Patron.findOne({
    where: {id: req.params.id},
  }).then(results => {
  Loan.findAll({
    where: {patron_id: req.params.id},
    include: [Book, Patron]
  }).then(loan =>{
    res.render("patron_details", {patron: results, loans: loan})
  }).catch((err)=>next(err))
})});

app.post("/patrons/details/:id", (req, res ,next) => {
   Patron.findOne({
     where: { id: req.params.id}
   }).then(patron => {
     return patron.update(req.body);

   }).then(loan => {
    return res.redirect("/patrons/all")
   })

})





app.get("/loans/new", (req, res, next) => {
    Book.findAll()
    .then(books => {
      Patron.findAll().then(patrons => {


        return res.render("new_loan", {books, patrons, loaned_on: dateNow, return_by: returnBy})
      }).catch(err => next(err))
    }).catch(err => next(err))
});


app.post("/loans/new", (req, res, next) => {
  Loan.create(req.body)
    .then(loan => {

    return res.redirect("/loans/all");
  })});



  app.get('/loans/all', (req, res, next) => {
      Loan.findAll({
      include: [Book, Patron]
        })
      .then(results => {
        console.log(results[1].loaned_on.toString())
        res.render("all_loans", {loans: results})
    }).catch(err => next(err))
  });






// remember Neil lt means less than, so only return a book that is less than today's date

app.get("/loans/overdue_loan", (req,res, next) => {
  Loan.findAll(
    {
     include: [Book, Patron],
     where: {
       returned_on: null,
       return_by:  {[Op.lt]: dateNow}
       }
    }
  )  .then(results => {
    console.log(results)
  res.render("overdue_loans", {loans: results});
}).catch(err => next(err))
});



app.get("/loans/checked_loan", (req,res) => {
  Loan.findAll({
         where:{returned_on: null},
         include: [Book, Patron]
      })
    .then(results => {
  res.render("checked_loans", {loans:results});
}).catch(err => next(err))
});
