'use strict';
const bcrypt = require("bcryptjs")
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'emily@user.io',
        username: 'EmilyT_2024',
        firstName: 'Emily',
        lastName: 'Thompson',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'Lucas@user.io',
        username: 'LucasM_88',
        firstName: 'Lucas',
        lastName: 'Martinez',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'Aisha@user.io',
        username: 'AishaK_09',
        firstName: 'Aisha',
        lastName: 'Khan',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'David@user.io',
        username: 'DaveLee_321',
        firstName: 'David',
        lastName: 'Lee',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'Sofia@user.io',
        username: 'SofiaG_1995',
        firstName: 'Sofia',
        lastName: 'Garcia',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        email: 'Jordan@user.io',
        username: 'JordanN_2023',
        firstName: 'Jordan',
        lastName: 'Nguyen',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        email: 'demo@user.io',
        username: 'dmoe_user',
        firstName: 'Demo',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password6')
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demon-lition', 'FakeUser1', 'FakeUser2']}
    }, {})
  }
};
