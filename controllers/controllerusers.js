const { obtenerUsuarios, obtenerUnUsuario, existeUsuario, eliminarUnUsuario, aniadirUsuario } = require('../services/servicesusers');

const User = require("../models/modeluser");
const bcrypt = require('bcryptjs');

const CobtenerUsuarios = async (req, res) => {

    /*const listaCarros = await Carro.findAll();*/
    const listaUsuarios = await obtenerUsuarios()

    res.send(listaUsuarios);
};

const CobtenerUnUsuario = async (req, res) => {
    // const data = req.body
    const { id } = req.params

    const user = await obtenerUnUsuario(req, res)

    const existe = await existeUsuario(id)
    console.log(`el usuario existe ? ${existe}`);
    try {
        if (existe) {
            res.json(user);
        }
        else {
            res.json(
                { msg: `el usuario con id:${id} no existe` }
            )
        }
    }
    catch (error) {
        res.send(error)
        //res.end();
    }

};


const CeliminarUnUsuario = async (req, res) => {

    await eliminarUnUsuario(req, res)

};

const CaniadirUsuario = async (req, res) => {

    await aniadirUsuario(req, res)

};


const CactualizarUnUsuario = async (req, res) => {
    const { id } = req.params;

    //const { body } = req;
    const { login, clave, sts, tipo } = req.body;
    const claveencriptada = bcrypt.hashSync(clave, 10);

    const carro = await User.findByPk(id);

    if (carro) {
        await carro.update({
            login: login,
            clave: claveencriptada,  // Clave encriptada
            sts: sts,
            tipo: tipo
        });
        res.json({
            msg: "El usuario  fue actualizado con éxito"
        });
    } else {
        res.json({
            msg: "No existe un usuario con el ID ingresado"
        });
    }
};

module.exports = { CobtenerUsuarios, CobtenerUnUsuario, CaniadirUsuario,
    CeliminarUnUsuario, CactualizarUnUsuario }