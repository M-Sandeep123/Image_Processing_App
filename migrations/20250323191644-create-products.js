'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      serialNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      requestId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'requests',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};
