'use strict';
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true},
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: {type:DataTypes.DATE},
    return_by: {type:DataTypes.DATE, timestamps:false},
    returned_on: {type:DataTypes.DATE, timestamps:false}
  }, {});
  Loan.associate = function(models) {
    Loan.belongsTo(models.Book, { foreignKey: 'book_id' });
    Loan.belongsTo(models.Patron, { foreignKey: 'patron_id' });
  };
  return Loan;
};
