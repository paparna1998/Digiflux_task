const { Sequelize, DataTypes } = require('sequelize');

const Click_Model = Sequelize.define('click', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    timestamp: { type: DataTypes.DATE },
    userAgent: { type: DataTypes.STRING },
    referrer: { type: DataTypes.STRING }
});

module.exports = Click_Model;