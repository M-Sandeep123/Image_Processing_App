'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'requests',
        key: 'id'
      }
    }
  }, {
    tableName: 'products'
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Request, { foreignKey: 'requestId', as: 'request' });
    Product.hasMany(models.Image, { foreignKey: 'productId', as: 'images', onDelete: 'CASCADE' });
  };

  return Product;
};
