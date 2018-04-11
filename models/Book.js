"use strict";
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define(
    "Book",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: 'The title is required' }
      }},
      author: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: 'The author is required' }
      }},
      genre: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: 'The genre is required' }
      }},
      first_published: {
        type: DataTypes.INTEGER,
      validate: { notEmpty: { msg: 'First published is required' }
    }}
    },
    {}
  );
  Book.associate = function(models) {
    Book.hasMany(models.Loan, { foreignKey: "book_id" });
  };
  return Book;
};
