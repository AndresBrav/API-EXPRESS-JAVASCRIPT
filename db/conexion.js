const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("carroscrud", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
