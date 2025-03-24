'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Image = sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    inputUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    outputUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    }
  }, {
    tableName: 'images'
  });

  Image.associate = (models) => {
    Image.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  };

  return Image;
};
