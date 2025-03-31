const { Request, Response } = require("express");
const Carro = require("../models/modelcarro");
const { obtenerCarros, obtenerUnCarro, eliminarUnCarro, aniadirCarro, existeCarro, guardarArchivosCarros, guardarArchivoUnCarro, subirListaServidor, obtenerBase64,convertirBase64toFile } = require("../services/servicescarros");
const User = require("../models/modeluser");
const { flushPages } = require("pdfkit");

const Cobtenercarros = async (req, res) => {

    /*const listaCarros = await Carro.findAll();*/
    const listaCarros = await obtenerCarros(req, res)

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
    // console.log("recuperado de usrt ", req.usrT);
    // console.log("recuperado de usrt ", req.usrT.u);

    /********* Obtenemos el id del usuario****** */
    const usuarioaux = await User.findOne({
        where: { login: req.usrT.u },
        raw: true
    })

    //console.log("el usuario que traje es");
    //console.log(usuarioaux);

    /**********Obtenemos la relacion ************* */
    const relacionCarroUsuario = await Carro.findAll({
        where: { user_id: usuarioaux.id },
        include: User
    });

    console.log("El carro que se actualizó es:");
    console.log(JSON.stringify(relacionCarroUsuario, null, 2));

    /******Guardamos sus id en un Arreglo */
    const idsCarros = [];
    relacionCarroUsuario.forEach(carro => {
        idsCarros.push(carro.id);
    });

    console.log("IDs de los carros:", idsCarros);

    let existeValor = idsCarros.includes(Number(id));
    console.log(id);
    console.log("El valor existe:", existeValor);

    // console.log("IDs de los carros:", idsCarros);
    // console.log("Tipos de datos en el array:", idsCarros.map(num => typeof num));
    // console.log("Tipo de id:", typeof id);


    const carro = await Carro.findByPk(id);

    if (carro && existeValor) {
        await carro.update(body);  //puedes enviar un solo dato {"nombre": "vw actualizado"}
        res.json({
            msg: "El producto fue actualizado con éxito"
        });
    } else {
        res.json({
            msg: "No existe un carro con el ID ingresado"
        });
    }
};

const CguardarArchivo = async (req, res) => {

    try {
        const { body } = req;
        const loginUsuario = req.usrT.u
        const tipoGuardado = body.tipoGuardado

        const base64Data = await guardarArchivosCarros(loginUsuario, tipoGuardado)  //guarda el pdf en la direccion 
        //await subirListaServidor() //sube los archivos al servidor 
        res.json({
            msg: "llegamos hasta aqui se guardo los carros",
            archivoB64: "El codigo base64 es:" + base64Data
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

const CguardarUnArchivo = async (req, res) => {

    try {
        const { id } = req.params
        const {  tipoGuardado } = req.body;

        const loginUsuario = req.usrT.u //USER1
        /********* Obtenemos el id del usuario****** */
        const usuarioaux = await User.findOne({
            where: { login: loginUsuario },
            raw: true
        })

        const listaDeCarrosDelUsuario = await Carro.findAll({
            where: {
                user_id: usuarioaux.id
            },
            raw: true
        })
        // console.log("...........................................");
        // console.log(listaDeCarrosDelUsuario);

        let idsCarros = [];
        listaDeCarrosDelUsuario.forEach(carro => {
            idsCarros.push(carro.id);
        });

        let existeValor = idsCarros.includes(Number(id));

        if (existeValor) {
            const base64Data = await guardarArchivoUnCarro(id, tipoGuardado) //guarda el pdf de un carro en la direccion 
            res.json({
                msg: "llegamos hasta aqui verifica que se haya subido el carro",
                archivoB64: base64Data
            })
        }
        else {
            res.json({
                msg: "El id del carro que ingresaste no pertenece al usuario que inicio sesion"
            })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }



    // await guardarPdfUnCarro(id, TipoTransferencia) //guarda el pdf de un carro en la direccion 

}

const CsubirServidor = async (req, res) => {
    const { nombreArchivo, TipoTransferencia, host, user, password } = req.body

    //Ejecutar la subida
    await subirListaServidor(nombreArchivo, TipoTransferencia, host, user, password);
    res.send({
        msg: "se subio al servidor"
    })
}


const CdevolverArchivoBase64 = async (req, res) => {

    try {
        const { nombreArchivo } = req.body
        const base64Data = await obtenerBase64(nombreArchivo);

        res.json({
            msg: "El codigo base64 se genero correctamente:",
            base64: base64Data
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}


const CconvertirBase64toFile = async (req, res) => {
    const {base64Data,nombreArchivo,extension} = req.body
    //const {base64Data,nombreArchivo} = req.body
    try {
        await convertirBase64toFile(base64Data, nombreArchivo, extension);
        //await convertirBase64toFile(base64Data, nombreArchivo);
        res.json(
            {msg: "El archivo se convirtio correctamente"}
        )
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

// const CsubirUnCarroServidor = async (req, res) => {
//     const { nombreArchivo, TipoTransferencia, host, user, password } = req.body

//     //Ejecutar la subida
//     await SubirCarroServidor(nombreArchivo, TipoTransferencia, host, user, password);
//     res.send({
//         msg: "se subio al servidor"
//     })
// }



module.exports = { Cobtenercarros, Cobteneruncarro, CeliminarCarro, CaniadirCarro, CactualizarCarro, CguardarArchivo, CguardarUnArchivo, CsubirServidor, CdevolverArchivoBase64,CconvertirBase64toFile };
