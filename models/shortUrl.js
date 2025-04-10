const { Sequelize, DataTypes } = require('sequelize');

const ShortUrl_Model = Sequelize.define('shortUrl', {
    id: { type: id, primaryKey: true, unique: true, },
    originalUrl: { type: DataTypes.STRING, allowNull: false },
    shortCode: { type: DataTypes.STRING, unique: true, allowNull: false },
    clicks: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = ShortUrl_Model;