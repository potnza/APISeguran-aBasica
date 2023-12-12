// Log.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conecta.js';

export const Log = sequelize.define('log', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  descricao: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  complemento: {
    type: DataTypes.STRING(60),
    allowNull: false
  }
}, {
  timestamps: { updatedAt: false },
});
