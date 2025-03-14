const db = require('../db/conexion');
const { DataTypes } = require('sequelize');

// define crea o usa 
const User = db.define("User", {
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

module.exports = User;