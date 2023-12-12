// Livro.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conecta.js';

export const Livro = sequelize.define('livro', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  autor: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tema: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  dataLancamento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  paranoid: true
});

