// src/database/seeders/YYYYMMDDHHMMSS-demo-role.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Roles', [
            { name: 'admin', createdAt: new Date(), updatedAt: new Date() },
            { name: 'karyawan', createdAt: new Date(), updatedAt: new Date() }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Roles', null, {});
    }
};
