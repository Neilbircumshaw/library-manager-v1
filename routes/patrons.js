const express = require("express");
const Book = require("../models").Book;
const Patron = require("../models").Patron;
const Loan = require("../models").Loan;
const router = express.Router();

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/

/* build instance of patron - for error handling, then render the new patron page. */

router.get("/patrons/new", (req,res) => {
  const patron = Patron.build();
  res.render("new_patron", {patron: patron});
});

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/


/* create a patron in Patron model with the request object body which looks at the forms name values and inserts these values into the database.
then redirect to all patrons. If nothing entered on form it will throw error. Build instance of patron with req.body and then go back to the new book page
passing through the error and calling it in the template with error.message, which loops around and finds the fields that are not filled in. */

router.post("/patrons/new", (req, res, next) => {
  Patron.create(req.body)
    .then(patron => {
    return res.redirect("/patrons/all");
  }).catch(function(err) {
        if(err.name === "SequelizeValidationError") {
          const patron = Patron.build(req.body);
          console.log(patron)
          res.render("new_patron", {errors: err.errors, patron: patron});
        }
      });})

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/

  //finds all patrons details then passes to template as varaible "patrons"


router.get("/patrons/all", (req, res, next) => {
  Patron.findAll()
    .then(results => {
      res.render("all_patrons", {patrons: results});
  }).catch(err => next(err))
});

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/

/* Find one patron with id that matches the req.params.id (this is passed in the template) Then find all hs persons loans, where the patron_id is again equal
to the req.params.id, include book and patron models. pass down information from results as "patrons" varaible and "loans" varaible.*/


router.get("/patrons/details/:id", (req, res, next) => {
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

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/

/*find one patron where id = the req.params.id then with the info submited by the form, update this row in the database. then redirect to all patrons.*/

router.post("/patrons/details/:id", (req, res ,next) => {
   Patron.findOne({
     where: { id: req.params.id}
   }).then(patron => {
     return patron.update(req.body);

   }).then(loan => {
    return res.redirect("/patrons/all")
   })

})

/*-----------------------------------------------------------------------------------------------------------------------------------------------------*/

module.exports = router;
