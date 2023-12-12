import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  'livros', 'lucas', '1903', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});