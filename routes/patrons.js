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






router.get("/patrons/new", (req,res) => {
  res.render("new_patron");
});

router.post("/patrons/new", (req, res, next) => {
  Patron.create(req.body)
    .then(patron => {
    return res.redirect("/patrons/all");
  })});


router.get("/patrons/all", (req, res, next) => {
  Patron.findAll()
    .then(results => {
      res.render("all_patrons", {patrons: results});
  }).catch(err => next(err))
});






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

router.post("/patrons/details/:id", (req, res ,next) => {
   Patron.findOne({
     where: { id: req.params.id}
   }).then(patron => {
     return patron.update(req.body);

   }).then(loan => {
    return res.redirect("/patrons/all")
   })

})


module.exports = router;
