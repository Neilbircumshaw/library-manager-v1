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






router.get("/loans/new", (req, res, next) => {
    Book.findAll()
    .then(books => {
      Patron.findAll().then(patrons => {


        return res.render("new_loan", {books, patrons, loaned_on: dateNow, return_by: returnBy})
      }).catch(err => next(err))
    }).catch(err => next(err))
});


router.post("/loans/new", (req, res, next) => {
  Loan.create(req.body)
    .then(loan => {

    return res.redirect("/loans/all");
  })});



  router.get('/loans/all', (req, res, next) => {
      Loan.findAll({
      include: [Book, Patron]
        })
      .then(results => {
        res.render("all_loans", {loans: results})
    }).catch(err => next(err))
  });






// remember Neil lt means less than, so only return a book that is less than today's date

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



router.get("/loans/checked_loan", (req,res) => {
  Loan.findAll({
         where:{returned_on: null},
         include: [Book, Patron]
      })
    .then(results => {
  res.render("checked_loans", {loans:results});
}).catch(err => next(err))
});

module.exports = router;
