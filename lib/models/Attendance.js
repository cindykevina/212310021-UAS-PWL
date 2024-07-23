// lib/models/Attendance.js

import { Model, DataTypes } from 'sequelize';
import connection from '../../config/connection';
import User from './User';

class Attendance extends Model {}

Attendance.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  checkIn: {
    type: DataTypes.DATE,
    allowNull: false
  },
  checkOut: {
    type: DataTypes.DATE,
    allowNull: true
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: true
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: true
  },
  checkInPhoto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  checkOutPhoto: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: connection,
  modelName: 'Attendance',
  tableName: 'Attendance',
  timestamps: true
});

Attendance.belongsTo(User, { foreignKey: 'userId' });

export default Attendance;
