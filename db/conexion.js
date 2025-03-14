const { Sequelize } = require("sequelize");


const db = new Sequelize("carroscrud", "root", "", {
    host: "localhost",
    dialect: "mysql",
});


module.exports = db;
