// lib/models/User.js

import { Model, DataTypes } from 'sequelize';
import connection from '../../config/connection';
import Roles from './Roles'; // Pastikan Roles diimpor di sini

const initUser = (sequelize, Types) => {
  class User extends Model {}

  User.init({
    nama: Types.STRING,
    email: Types.STRING,
    no_telp: Types.STRING,
    password: Types.STRING,
    roleId: {
      type: Types.INTEGER,
      references: {
        model: 'Roles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
  });

  User.belongsTo(Roles, { foreignKey: 'roleId' }); // Perbaiki menjadi User.belongsTo(Roles, { foreignKey: 'roleId' })

  return User;
};

export default initUser(connection, DataTypes);
