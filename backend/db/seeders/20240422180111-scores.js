'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Scores"
    await queryInterface.bulkInsert(options, [
      {
        userId: 1,
        numbers: 500,
      },
      {
        userId: 2,
        numbers: 600,
      },
      {
        userId: 3,
        numbers: 700,
      },
      {
        userId: 5,
        numbers: 1000,
      },
      {
        userId: 4,
        numbers: 1500,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Scores"
    await queryInterface.bulkDelete(options)
  }
};
