const User = require("../models/modeluser");

/************CRUD************ */
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

const aniadirUsuario = async (req, res) => {
    const { body } = req;
    await User.create(body);
    res.json({
        msg: "Usuario fue agregado con éxito"
    });
}

module.exports ={obtenerUsuarios,obtenerUnUsuario,existeUsuario,eliminarUnUsuario,aniadirUsuario}