'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true},
    first_name: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: 'First name required' }
  }},
    last_name: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: 'Last name required' }
  }},
     address: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: 'Address required' }
  }},
     email: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: 'Email required' }
  }},
     library_id: {
       type: DataTypes.STRING,
       validate: { notEmpty: { msg: 'Library_id required' }
  }},
     zip_code: {
      type: DataTypes.INTEGER,
      validate: { notEmpty: { msg: 'zipcode required' }
  }}
  }, {});
  Patron.associate = function(models) {
    Patron.hasMany(models.Loan, { foreignKey: 'patron_id' });
  };
  return Patron;
};
