// src/database/migrations/YYYYMMDDHHMMSS-create-attendance.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Attendance', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            checkIn: {
                type: Sequelize.DATE,
                allowNull: false
            },
            checkOut: {
                type: Sequelize.DATE,
                allowNull: true
            },
            longitude: {
                type: Sequelize.STRING,
                allowNull: false
            },
            latitude: {
                type: Sequelize.STRING,
                allowNull: false
            },
            checkInPhoto: {
                type: Sequelize.STRING,
                allowNull: true
            },
            checkOutPhoto: {
                type: Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Attendance');
    }
};
