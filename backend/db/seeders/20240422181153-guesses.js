'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Guesses"
    await queryInterface.bulkInsert(options, [
      {
        gameId: 1,
        number: '1367',
        correct: 1,
        misplaced: 1,
        round: 10,
      },

    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Guesses"
    await queryInterface.bulkDelete(options)
  }
};
