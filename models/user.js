const { Sequelize, DataTypes } = require('sequelize');

const User_Model = Sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true },
  name: { type: DataTypes.TEXT },
  emailId: { type: DataTypes.TEXT },
  password: { type: DataTypes.TEXT },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = User_Model;