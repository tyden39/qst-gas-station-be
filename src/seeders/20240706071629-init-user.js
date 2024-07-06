'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      username: "admin",
      password: "$2b$10$Lc1/ClVHzXaAcmZYVxSMHexR3UM9mjjkmdLnpYhJwwK1x.pmujf7q",
      phone: "",
      email: "",
      firstName: "QSPECO",
      lastName: "Admin",
      roles: ["000", "001", "002", "003", "004"],
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
