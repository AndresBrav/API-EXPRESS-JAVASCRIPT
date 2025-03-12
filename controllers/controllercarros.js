const { Request, Response } = require("express");
const Carro = require("../models/modelcarro");
const { obtenerCarros, obtenerUnCarro, eliminarUnCarro, aniadirCarro,existeCarro } = require("../services/servicescarros")

const getCars = async (req, res) => {

    /*const listaCarros = await Carro.findAll();*/
    const listaCarros = await obtenerCarros()

    res.send(listaCarros);
};

const getOneCars = async (req, res) => {
    // const data = req.body
    const { id } = req.params

    const carro = await obtenerUnCarro(req, res)

    const existe = await existeCarro(id)
    console.log(`el carro existe ? ${existe}`);
    try {
        if (existe) {
            res.json(carro);
        }
        else{
            res.json(
                { msg: `el carro con id:${id} no existe`}
            )
        }
    }
    catch (error) {
        res.send(error)
        //res.end();
    }





    // const { id } = req.params;
    // const unCarro = await Carro.findByPk(id);

    // if (unCarro) {
    //     res.json(unCarro);
    // } else {
    //     res.json({
    //         msg: `No hay un carro con el ID ${id}`
    //     });
    // }
};

const delCars = async (req, res) => {

    await eliminarUnCarro(req, res)

    // const { id } = req.params;
    // const carro = await Carro.findByPk(id);
    // if (carro) {
    //     await carro.destroy();
    // }
    // res.json({
    //     msg: `Se eliminó el carro con ID ${id}`
    // });
};

const addCars = async (req, res) => {

    await aniadirCarro(req, res)
    // const { body } = req;
    // await Carro.create(body);

    // res.json({
    //     msg: "Carro fue agregado con éxito"
    // });
};

const updateCars = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    const carro = await Carro.findByPk(id);

    if (carro) {
        await carro.update(body);
        res.json({
            msg: "El producto fue actualizado con éxito"
        });
    } else {
        res.json({
            msg: "No existe un carro con el ID ingresado"
        });
    }
};

module.exports = { getCars, getOneCars, delCars, addCars, updateCars };
