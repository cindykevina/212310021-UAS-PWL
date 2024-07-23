import { Model, DataTypes } from 'sequelize';
import connection from '../../config/connection';

const initRoles = (sequelize, Types) => {
  class Roles extends Model {}

  Roles.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Roles',
    tableName: 'Roles',
    timestamps: true
  });

  return Roles;
};

export default initRoles(connection, DataTypes);
