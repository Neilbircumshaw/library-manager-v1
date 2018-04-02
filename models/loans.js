'use strict';
module.exports = (sequelize, DataTypes) => {
  var loans = sequelize.define('loans', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true},
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, {});
  loans.associate = function(models) {
    loans.belongsTo(models.books, { foreignKey: 'book_id' });
    loans.belongsTo(models.patrons, { foreignKey: 'patron_id' });
  };
  return loans;
};
