// src/database/seeders/YYYYMMDDHHMMSS-demo-user.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            { nama: 'admin panti wredha', email: 'admin@panti.com', no_telp: '088101010', password: '$2a$12$DPfKHeFt8WD/vwTms.BEJe9op4gg2nuUafN32qiN0uf1gxCOd.QoW', roleId: 1, createdAt: new Date(), updatedAt: new Date() },
            { nama: 'karyawan panti wredha' ,email: 'karyawan@panti.com', no_telp: '088202020', password: '$2a$12$kusYm3MgVju0g4Fq4./cy.5O0Fqs7u8pd0p73kqHzPrtlWjMkLNE6', roleId: 2, createdAt: new Date(), updatedAt: new Date() }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
