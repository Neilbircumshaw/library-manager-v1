'use strict';
module.exports = (sequelize, DataTypes) => {
  var Book = sequelize.define('Book', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
    title: {type: DataTypes.STRING, allowNull: false, validate: { notNull: { msg: 'Please enter a title of a book' }}},
    author: {type: DataTypes.STRING, allowNull: false, validate: { notNull: { msg: 'The author is required' }}},
    genre: {type: DataTypes.STRING, allowNull: false, validate: { notNull: { msg: 'The genre is required' }}},
    first_published: {type: DataTypes.INTEGER , allowNull: false, validate: { notNull: { msg: 'First published is required' }}}
  }, {});
  Book.associate = function(models) {
  Book.hasMany(models.Loan, { foreignKey: 'book_id' });
  };
  return Book;
};
