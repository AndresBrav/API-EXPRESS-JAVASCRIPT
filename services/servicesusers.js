const User = require("../models/modeluser");
const bcrypt = require('bcryptjs');

/************CRUD************ */
const aniadirUsuario = async (req, res) => {

    //const { body } = req;
    //await User.create(body);
    const { login, clave, sts, tipo } = req.body;
    // Hashear la clave antes de guardarla
    const claveencriptada = bcrypt.hashSync(clave, 10);

    // Crear usuario con clave hasheada
    const nuevoUsuario = await User.create({
        login: login,
        clave: claveencriptada,  // Clave encriptada
        sts: sts,
        tipo: tipo
    });
    res.json({
        msg: "Usuario fue agregado con éxito",
        usuario: nuevoUsuario
    });
}

const obtenerUsuarios = async () => {
    const user = await User.findAll()
    return user;
}

const obtenerUnUsuario = async (req, res) => {
    const { id } = req.params;
    const unUsuario = await User.findByPk(id);
    if (unUsuario) {
        return unUsuario
    } else {
        return null
    }
}

const existeUsuario = async (id) => {
    const user = await User.findByPk(id);
    return !!user; // Devuelve true si existe, false si no
};

const eliminarUnUsuario = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (user) {
        await user.destroy();
    }
    res.json({
        msg: `Se eliminó el usuario con ID ${id}`
    });
}



module.exports = { obtenerUsuarios, obtenerUnUsuario, existeUsuario, eliminarUnUsuario, aniadirUsuario }