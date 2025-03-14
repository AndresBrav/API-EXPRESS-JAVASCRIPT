const express = require('express');

const {validToken} = require("../middelwares/tokenValidator")

const {getUsers,getOneUser,delUser,addUser,updateUser} = require('../controllers/controllerusers')

const rutasUsuarios = express.Router();

rutasUsuarios.get('/',getUsers);

rutasUsuarios.get('/:id', getOneUser);

rutasUsuarios.delete('/:id',delUser);

rutasUsuarios.post('/', addUser);

rutasUsuarios.put('/:id', updateUser);


module.exports=rutasUsuarios