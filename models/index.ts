const Sequelize = require("sequelize");
require("dotenv").config();

const db: any = {};
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect:process.env.DB_DIALECT,
    }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;