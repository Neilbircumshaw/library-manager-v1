'use strict';
module.exports = (sequelize, DataTypes) => {
  var Patron = sequelize.define('Patron', {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true},
    first_name: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: 'First name required' }, isAlpha:{msg: "Please enter a valid name!"}
  }},
    last_name: {
        type: DataTypes.STRING,
        validate: { notEmpty: { msg: 'Last name required' }, isAlpha:{msg: "Please enter a valid name!"}
  }},
     address: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: 'Address required' }
  }},
     email: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: 'Email required' },  isEmail: {msg: "Please enter a valid email!"}
  }},
     library_id: {
       type: DataTypes.STRING,
       validate: { notEmpty: { msg: 'Library_id required' }, contains:{args: "MCL", msg:"Our Library card starts with MCL!"}
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
