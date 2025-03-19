const express = require('express');

const { validToken } = require("../middelwares/tokenValidator")

const { CobtenerUsuarios, CobtenerUnUsuario, CeliminarUnUsuario, CaniadirUsuario, CactualizarUnUsuario } = require('../controllers/controllerusers')

const rutasUsuarios = express.Router();

rutasUsuarios.get('/', [validToken], CobtenerUsuarios);

rutasUsuarios.get('/:id', [validToken], CobtenerUnUsuario);

rutasUsuarios.delete('/:id', [validToken], CeliminarUnUsuario);

rutasUsuarios.post('/', [validToken], CaniadirUsuario);

rutasUsuarios.put('/:id', [validToken], CactualizarUnUsuario);


module.exports = rutasUsuarios