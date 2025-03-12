const Carro = require("../models/modelcarro");

const obtenerCarros = async () => {
    const carro = await Carro.findAll()
    return carro;
}

obtenerUnCarro = async (req, res) => {
    const { id } = req.params;
    const unCarro = await Carro.findByPk(id);

    //console.log(unCarro.id);

    //const existe = await existeCarro(id);
    //console.log(existe); // Imprime true si existe, false si no

    if (unCarro) {
        return unCarro
    } else {
        return null
    }
    // res.json({
    //     msg: "existe el carro "
    // })
}

const existeCarro = async (id) => {
    const carro = await Carro.findByPk(id);
    return !!carro; // Devuelve true si existe, false si no
};



const eliminarUnCarro = async (req, res) => {
    const { id } = req.params;
    const carro = await Carro.findByPk(id);
    if (carro) {
        await carro.destroy();
    }
    res.json({
        msg: `Se eliminó el carro con ID ${id}`
    });
}

const aniadirCarro = async (req, res) => {
    const { body } = req;
    await Carro.create(body);

    // return "carro agregado con exito"
    res.json({
        msg: "Carro fue agregado con éxito"
    });
}

module.exports = { obtenerCarros, obtenerUnCarro, eliminarUnCarro, aniadirCarro,existeCarro }