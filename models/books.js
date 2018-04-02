'use strict';
module.exports = (sequelize, DataTypes) => {
  var books = sequelize.define('books', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,

     },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    first_published: DataTypes.INTEGER
  }, {});
  books.associate = function(models) {
  books.hasMany(models.loans, { foreignKey: 'book_id' });
  };
  return books;
};
