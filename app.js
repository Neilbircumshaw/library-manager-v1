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
const homePageRoute = require('./routes');
const bookRoutes = require('./routes/books');
const patronRoutes = require('./routes/patrons');
const loanRoutes = require('./routes/loans');




app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

sequelize.sync().then(function(){
app.listen(3000);
});

app.set("view engine", "pug");

app.use(homePageRoute);
app.use(bookRoutes);
app.use(patronRoutes);
app.use(loanRoutes);
app.get('*', (req, res, next) => {
  res.render("404_error");
});
