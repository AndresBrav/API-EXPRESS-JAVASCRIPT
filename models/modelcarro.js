const db = require('../db/conexion');
const { DataTypes } = require('sequelize');

// define crea o usa
const Carro = db.define("Carro", {
    nombre: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.STRING
    },
    precio: {
        type: DataTypes.DOUBLE
    },
    stock: {
        type: DataTypes.INTEGER // Se recomienda usar INTEGER en lugar de NUMBER
    }
},
    {
        createdAt: false, // Para que no tenga la columna createdAt
        updatedAt: false // Para que no tenga la columna updatedAt
    });

module.exports = Carro;
