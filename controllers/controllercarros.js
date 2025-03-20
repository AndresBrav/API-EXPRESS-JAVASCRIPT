const { Request, Response } = require("express");
const Carro = require("../models/modelcarro");
const { obtenerCarros, obtenerUnCarro, eliminarUnCarro, aniadirCarro, existeCarro, guardarPdfCarros, guardarPdfUnCarro, subirListaServidor, SubirCarroServidor } = require("../services/servicescarros")

const Cobtenercarros = async (req, res) => {

    /*const listaCarros = await Carro.findAll();*/
    const listaCarros = await obtenerCarros()

    res.send(listaCarros);
};

const Cobteneruncarro = async (req, res) => {
    // const data = req.body
    const { id } = req.params

    const carro = await obtenerUnCarro(req, res)

    const existe = await existeCarro(id)
    console.log(`el carro existe ? ${existe}`);
    try {
        if (existe) {
            res.json(carro);
        }
        else {
            res.json(
                { msg: `el carro con id:${id} no existe` }
            )
        }
    }
    catch (error) {
        res.send(error)
        //res.end();
    }

};

const CeliminarCarro = async (req, res) => {
    await eliminarUnCarro(req, res)
};

const CaniadirCarro = async (req, res) => {

    await aniadirCarro(req, res)

};

const CactualizarCarro = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    console.log("recuperado de usrt ", req.usrT);
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

const gcp = async (req, res) => {
    const { body } = req;
    console.log(body.TipoTransferencia);
    await guardarPdfCarros(body.TipoTransferencia)  //guarda el pdf en la direccion 
    //await subirListaServidor() //sube los archivos al servidor 
    res.json({
        msg: "llegamos hasta aqui se guardo los carros"
    })

}

const gucp = async (req, res) => {
    const { id } = req.params
    const { TipoTransferencia } = req.body;
    await guardarPdfUnCarro(id, TipoTransferencia) //guarda el pdf de un carro en la direccion 


    res.json({
        msg: "llegamos hasta aqui verifica que se haya subido el carro"
    })
}

const CsubirServidor = async (req, res) => {
    const { nombreArchivo, TipoTransferencia, host,user,password } = req.body

    //Ejecutar la subida
    await subirListaServidor(nombreArchivo, TipoTransferencia, host,user,password);
    res.send({
        msg: "se subio al servidor"
    })
}

const CsubirUnCarroServidor = async (req, res) => {
    const { nombreArchivo, TipoTransferencia, host,user,password } = req.body

    //Ejecutar la subida
    await SubirCarroServidor(nombreArchivo, TipoTransferencia, host,user,password);
    res.send({
        msg: "se subio al servidor"
    })
}



module.exports = { Cobtenercarros, Cobteneruncarro,CeliminarCarro,CaniadirCarro, CactualizarCarro, gcp, gucp, CsubirServidor, CsubirUnCarroServidor };
