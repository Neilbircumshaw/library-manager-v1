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





router.get("/", (req,res) => {
  res.render("home");
});

module.exports = router;
