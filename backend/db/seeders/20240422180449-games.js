'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Games"
    await queryInterface.bulkInsert(options, [
      {
        userId: 1,
        difficulty: 1,
        number: '1234',
        solve: true
      },
      {
        userId: 2,
        difficulty: 2,
        number: '1234',
        solve: true
      },
      {
        userId: 3,
        difficulty: 1,
        number: '1234',
        solve: true
      },
      {
        userId: 5,
        difficulty: 2,
        number: '1234',
        solve: true
      },
      {
        userId: 4,
        difficulty: 3,
        number: '1234',
        solve: false
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Games"
    await queryInterface.bulkDelete(options)
  }
};
