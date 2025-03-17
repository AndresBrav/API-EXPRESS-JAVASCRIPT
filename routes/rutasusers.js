const express = require('express');

const { validToken } = require("../middelwares/tokenValidator")

const { getUsers, getOneUser, delUser, addUser, updateUser } = require('../controllers/controllerusers')

const rutasUsuarios = express.Router();

rutasUsuarios.get('/', [validToken], getUsers);

rutasUsuarios.get('/:id', [validToken], getOneUser);

rutasUsuarios.delete('/:id', [validToken], delUser);

rutasUsuarios.post('/', [validToken], addUser);

rutasUsuarios.put('/:id', [validToken], updateUser);


module.exports = rutasUsuarios