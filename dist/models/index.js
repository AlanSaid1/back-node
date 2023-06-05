"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
require("dotenv").config(); //Importar variables de entorno
const db = {};
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
exports.default = db;
//# sourceMappingURL=index.js.map