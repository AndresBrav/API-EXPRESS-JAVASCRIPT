const db = require('../db/conexion');
const { DataTypes } = require('sequelize');
const Carro = require("../models/modelcarro");

// define crea o usa
const User = db.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    login: {
        type: DataTypes.STRING
    },
    clave: {
        type: DataTypes.STRING
    },
    sts: {
        type: DataTypes.STRING
    },
    tipo: {
        type: DataTypes.STRING
    }
},
{
    createdAt: false, // Para que no tenga la columna createdAt
    updatedAt: false // Para que no tenga la columna updatedAt
});

User.hasMany(Carro, {
    foreignKey: 'user_id',
    sourceKey: 'id'
});

Carro.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

// Sincroniza los modelos con la base de datos
// (async () => {
//     await db.sync();
// })();
// Sincroniza los modelos con la base de datos solo si no existen
(async () => {
    await db.sync({ alter: true });
})();

module.exports = User;
