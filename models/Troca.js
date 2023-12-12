import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conecta.js';

export const Troca = sequelize.define('troca', {
  id : {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  hash: {
    type: DataTypes.STRING(32),
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: false
});
