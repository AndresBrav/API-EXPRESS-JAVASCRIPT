const { Request, Response } = require("express");
const Carro = require("../models/modelcarro");
const { obtenerCarros, obtenerUnCarro, eliminarUnCarro, aniadirCarro,existeCarro,guardarPdfCarros,guardarPdfUnCarro,subirListaServidor,SubirCarroServidor } = require("../services/servicescarros")

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

const gcp = async(req,res) => {
    const { body } = req;
    console.log(body.TipoTransferencia);
    await guardarPdfCarros(body.TipoTransferencia)  //guarda el pdf en la direccion 
    //await subirListaServidor() //sube los archivos al servidor 
    res.json({
        msg: "llegamos hasta aqui se guardo los carros"
    })
    
}

const gucp = async(req,res) => {
    const { id } = req.params
    const {TipoTransferencia}  = req.body;
    await guardarPdfUnCarro(id,TipoTransferencia) //guarda el pdf de un carro en la direccion 
    //await SubirCarroServidor() //sube el pdf de un carro al servidor 

    res.json({
        msg: "llegamos hasta aqui verifica que se haya subido el carro"
    })
}

module.exports = { getCars, getOneCars, delCars, addCars, updateCars,gcp,gucp };
