const express = require("express");
const app = express();
const sequelize = require("./models").sequelize;
const books = require("./models").books;

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

app.get("/books/all", (req,res) => {
  res.render("all_books");
});

app.get("/books/overdue", (req,res) => {
  res.render("overdue_books");
});

app.get("/books/checked_out", (req,res) => {
  res.render("checked_books");
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

app.get("/patrons/all", (req,res) => {
  res.render("all_patrons");
});

app.get("/patrons/details", (req,res) => {
  res.render("patron_details");
});

app.get("/loan/new", (req,res) => {
  res.render("new_loan");
});

app.get("/loan/all", (req,res) => {
  res.render("all_loans");
});

app.get("/loan/overdue_loans", (req,res) => {
  res.render("overdue_loans");
});

app.get("/loan/checked_loans", (req,res) => {
  res.render("checked_loans");
});

app.use(express.static("public"));
