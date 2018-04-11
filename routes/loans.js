const express = require("express");
const Sequelize = require('sequelize');
const Book = require("../models").Book;
const Patron = require("../models").Patron;
const Loan = require("../models").Loan;
const moment = require("moment");
const dateNow = moment().format('YYYY-MM-DD');
const returnBy = moment().add(7, 'days').format('YYYY-MM-DD');
const Op = Sequelize.Op
const router = express.Router();

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/

/* find all books and find all patrons, pass those results as varibles (books and patrons), also pass the template
 loaned_on and returned_by (values for these at top of page)*/

router.get("/loans/new", (req, res, next) => {
    Book.findAll()
    .then(books => {
      Patron.findAll().then(patrons => {
        return res.render("new_loan", {books, patrons, loaned_on: dateNow, return_by: returnBy})
      }).catch(err => next(err))
    }).catch(err => next(err))
});

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/

/* creates a new loan with the information provided by the user, which is mapped by the name values which are passed into the req.body, which are then passed
into the database. error finds all books and patrons and passes these into the new loan route again like with the get request, also passes the error, which is
used in the template with error.message, which iterates over errors and spits out a messsage that was defined in the model. */

router.post("/loans/new", (req, res, next) => {
  Loan.create(req.body)
    .then(loan => {

    return res.redirect("/loans/all");
  }) .catch(function(err) {
        if(err.name === "SequelizeValidationError") {
          Book.findAll().then(books => {
            Patron.findAll().then(patrons => {
              res.render("new_loan", { books, patrons, errors:err.errors, loaned_on: dateNow, return_by: returnBy})});
          });
        }
      });
});

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/


/* simply gets all the loans, patrons and books data and passes it through*/

  router.get('/loans/all', (req, res, next) => {
      Loan.findAll({
      include: [Book, Patron]
        })
      .then(results => {
        res.render("all_loans", {loans: results})
    }).catch(err => next(err))
  });

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/

  /*finds all loans that have the returned on value as null, because it needs to find all that haven't been returned yet. includes the books and patrons
  models within this. all this info is passed as an argument called results which is passed down to the template as the varible "loans"*/

router.get("/loans/overdue_loan", (req,res, next) => {
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

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/

/*finds all loans that have the returned on value as null, because it needs to find all that haven't been returned yet. Includes the books and patrons
models within this. all this info is passed as an argument called results which is passed down to the template as the varible "loans"*/


router.get("/loans/checked_loan", (req,res) => {
  Loan.findAll({
         where:{returned_on: null},
         include: [Book, Patron]
      })
    .then(results => {
  res.render("checked_loans", {loans:results});
}).catch(err => next(err))
});

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/

module.exports = router;
