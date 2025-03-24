'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('requests', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed'),
        defaultValue: 'pending'
      },
      webhookUrl: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('requests');
  }
};
