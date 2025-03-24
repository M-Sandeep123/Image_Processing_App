'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Request = sequelize.define('Request', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    webhookUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'requests'
  });

  Request.associate = (models) => {
    Request.hasMany(models.Product, { foreignKey: 'requestId', as: 'products', onDelete: 'CASCADE' });
  };

  return Request;
};
