const Carro = require("../models/modelcarro");
const PDFDocument = require("pdfkit");   //biblioteca para guardar pdf
const fs = require("fs");
const uploadFileToFTP = require('./basic-ftp') //metodo para subir al servidor
const path = require('path');
const User = require('../models/modeluser')

const convertirYGuardarArchivoBase64 = require('./Convertir_B64')

/************CRUD************ */
const obtenerCarros = async (req, res) => {
    const loginUsuario = req.usrT.u
    console.log("recuperado de usrt ", req.usrT.u);

    // Obtener el ID del usuario a partir de su nombre
    const usuario = await User.findOne({ where: { login: loginUsuario } });
    //console.log("El usuario que vino es:", JSON.stringify(usuario, null, 2));
    const idUsuario = usuario.id;
    console.log("el id del usuario es " + idUsuario);


    /*****Retornar carros  */
    // Obtener los carros asociados a ese usuario
    const carros = await Carro.findAll({ where: { user_id: idUsuario } });

    //const carro = await Carro.findAll()
    return carros;
}

const existeCarro = async (id) => {
    const carro = await Carro.findByPk(id);
    return !!carro; // Devuelve true si existe, false si no
};



const eliminarUnCarro = async (req, res) => {

    const loginusuario = req.usrT.u  //con el que inicio sesion
    // const { body } = req.body;
    const idUsuario = await User.findOne({
        where: { login: loginusuario },
        attributes: ["id"],
        raw: true  // <- Esto hace que devuelva un objeto simple 
    });

    // Extraer solo el ID
    const userId = idUsuario ? idUsuario.id : null;

    console.log("el id del usuario es " + userId);



    const user_ids = await Carro.findAll({
        where: { user_id: userId },
        raw: true
    });

    console.log("el id de los usuarios es.......");
    console.log(user_ids);

    const userIdArray = user_ids.map(user => user.id);
    console.log(userIdArray);
    res.end();

    // const { id } = req.params;
    // const carro = await Carro.findByPk(id);
    // if (carro) {
    //     await carro.destroy();
    // }
    // res.json({
    //     msg: `Se eliminó el carro con ID ${id}`
    // });
}


const aniadirCarro = async (req, res) => {

    const { nombre, descripcion, precio, stock } = req.body

    //console.log("recuperado de usrt ", req.usrT.u);

    const loginusuario = req.usrT.u  //con el que inicio sesion
    // const { body } = req.body;
    const idUsuario = await User.findOne({
        where: { login: loginusuario },
        attributes: ["id"],
        raw: true  // <- Esto hace que devuelva un objeto simple 
    });

    // Extraer solo el ID
    const userId = idUsuario ? idUsuario.id : null;

    console.log("el id del usuario es " + userId);

    const nuevoAuto = await Carro.create({
        nombre: nombre,
        descripcion: descripcion,  // Clave encriptada
        precio: precio,
        stock: stock,
        user_id: userId
    });

    res.json({
        msg: "Carro fue agregado con éxito",
        nuevoAuto
    });
}

const obtenerUnCarro = async (req, res) => {
    const { id } = req.params;
    const unCarro = await Carro.findByPk(id);
    if (unCarro) {
        return unCarro
    } else {
        return null
    }

}

/***********Seccion de pdf**************/

const guardarArchivosCarros = async (loginUsuario, tipoGuardado) => {
    return new Promise(async (resolve, reject) => {
        try {
            const usuario = await User.findOne({ where: { login: loginUsuario } });
            if (!usuario) return reject("Usuario no encontrado");

            const idUsuario = usuario.id;
            console.log("El ID del usuario es " + idUsuario);

            const carros = await Carro.findAll({ where: { user_id: idUsuario } });
            if (!carros.length) return reject("No se encontraron carros para el usuario");

            let nombreDelArchivo = "";
            const folderPath = path.join(__dirname, "../ArchivosGuardados");
            if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

            if (tipoGuardado === "txt") {
                let filePath = path.join(folderPath, "lista_carros.txt");
                let i = 1;
                while (fs.existsSync(filePath)) {
                    filePath = path.join(folderPath, `lista_carros${i}.txt`);
                    i++;
                }
                nombreDelArchivo = path.basename(filePath);

                const fileContent = carros.map((carro, index) =>
                    `${index + 1}. ID: ${carro.id} - Nombre: ${carro.nombre} - Descripción: ${carro.descripcion} - Precio: ${carro.precio} - Stock: ${carro.stock}`
                ).join("\n");

                fs.writeFile(filePath, fileContent, async (err) => {
                    if (err) return reject("Error al guardar el archivo TXT: " + err);
                    console.log("Archivo TXT guardado en:", filePath);

                    const variableBase64 = await convertirYGuardarArchivoBase64(nombreDelArchivo);
                    resolve(variableBase64);
                });

            } else if (tipoGuardado === "pdf") {
                let filePath = path.join(folderPath, "lista_carros.pdf");
                let i = 1;
                while (fs.existsSync(filePath)) {
                    filePath = path.join(folderPath, `lista_carros${i}.pdf`);
                    i++;
                }
                nombreDelArchivo = path.basename(filePath);

                const doc = new PDFDocument();
                const writeStream = fs.createWriteStream(filePath);
                doc.pipe(writeStream);

                doc.fontSize(20).text("Lista de Carros", { align: "center" }).moveDown();
                carros.forEach((carro, index) => {
                    doc.fontSize(14).text(`${index + 1}. ID: ${carro.id} - Nombre: ${carro.nombre} - Descripción: ${carro.descripcion} - Precio: ${carro.precio} - Stock: ${carro.stock}`);
                    doc.moveDown(0.5);
                });

                doc.end();

                writeStream.on("finish", async () => {
                    console.log("PDF guardado en:", filePath);
                    const variableBase64 = await convertirYGuardarArchivoBase64(nombreDelArchivo);
                    resolve(variableBase64);
                });

                writeStream.on("error", (err) => reject("Error al guardar el PDF: " + err));
            } else {
                reject("Tipo de guardado no soportado.");
            }
        } catch (error) {
            reject("Error en el proceso: " + error);
        }

    }
    );
};

const guardarArchivoUnCarro = async (id, tipoGuardado) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("el tipo de guardado es: " + tipoGuardado);
            const carro = await Carro.findByPk(id);
            const existe = await existeCarro(id)

            let nombreDelArchivo = "";
            const folderPath = path.join(__dirname, "../ArchivosGuardados");
            if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

            if (tipoGuardado === "txt" && existe) {
                let filePath = path.join(folderPath, "Carro.txt");
                let i = 1;
                while (fs.existsSync(filePath)) {
                    filePath = path.join(folderPath, `Carro${i}.txt`);
                    i++;
                }
                nombreDelArchivo = path.basename(filePath);

                // Crear el contenido del archivo .txt
                let fileContent = "Detalle de Carro\n\n";

                // Agregar los carros al archivo .txt

                fileContent += ` ID: ${carro.id} - Nombre: ${carro.nombre} - Descripcion: ${carro.descripcion} - Precio: ${carro.precio} - Stock: ${carro.stock}\n`;

                fs.writeFile(filePath, fileContent, async (err) => {
                    if (err) return reject("Error al guardar el archivo TXT: " + err);
                    console.log("Archivo TXT guardado en:", filePath);

                    const variableBase64 = await convertirYGuardarArchivoBase64(nombreDelArchivo);
                    resolve(variableBase64);
                });

            } else if (tipoGuardado === "pdf" && existe) {
                let filePath = path.join(folderPath, "Carro.pdf");
                let i = 1;
                while (fs.existsSync(filePath)) {
                    filePath = path.join(folderPath, `Carro${i}.pdf`);
                    i++;
                }
                nombreDelArchivo = path.basename(filePath);

                const doc = new PDFDocument();
                const writeStream = fs.createWriteStream(filePath);
                doc.pipe(writeStream);

                doc.fontSize(20).text("Detalles del Carro", { align: "center" }).moveDown();

                //agregar carro al pdf
                doc.fontSize(14).text(`ID: ${carro.id} - Nombre: ${carro.nombre} - Descripcion: ${carro.descripcion} - Precio: ${carro.precio} - Stock:${carro.stock}`)


                doc.end();

                writeStream.on("finish", async () => {
                    console.log("PDF guardado en:", filePath);
                    const variableBase64 = await convertirYGuardarArchivoBase64(nombreDelArchivo);
                    resolve(variableBase64);
                });

                writeStream.on("error", (err) => reject("Error al guardar el PDF: " + err));
            } else {
                reject("Tipo de guardado no soportado.");
            }
        } catch (error) {
            reject("Error en el proceso: " + error);
        }

    }
    );
};


/*************Subir al servidor ********* */
const subirListaServidor = async (nombreArchivo, TipoTransferencia, host, user, password) => {
    // Ruta relativa al archivo
    const localFilePath = `../ArchivosGuardados/${nombreArchivo}`;

    // Convertir la ruta relativa a una ruta absoluta
    const absoluteFilePath = path.resolve(__dirname, localFilePath);
    //console.log("la ruta absoluta es : " + absoluteFilePath);

    const remoteFilePath = `/${nombreArchivo}`;
    //const transferMode = 'binary';
    const transferMode = TipoTransferencia;
    console.log(`ahora ..........El tipo de transferencia es ${TipoTransferencia}`);

    //uploadFileToFTP(localFilePath, remoteFilePath, transferMode);
    await uploadFileToFTP(absoluteFilePath, remoteFilePath, transferMode, host, user, password);
}

// const SubirCarroServidor = async (nombreArchivo, TipoTransferencia, host, user, password) => {

//     try {
//         // Ruta relativa al archivo
//         const localFilePath = `../ArchivosGuardados/${nombreArchivo}`;

//         // Convertir la ruta relativa a una ruta absoluta
//         const absoluteFilePath = path.resolve(__dirname, localFilePath);
//         //console.log("la ruta absoluta es : " + absoluteFilePath);

//         const remoteFilePath = `/${nombreArchivo}`;
//         const transferMode = TipoTransferencia;
//         console.log(`ahora.....................El tipo de transferencia es ${TipoTransferencia}`);

//         //uploadFileToFTP(localFilePath, remoteFilePath, transferMode);
//         await uploadFileToFTP(absoluteFilePath, remoteFilePath, transferMode, host, user, password);
//     }
//     catch (error) {
//         console.log("no existe el carro en el directorio");
//     }

// }

const obtenerBase64 = async (nombreArchivo) => {
    return new Promise(async (resolve, reject) => {
        try {
            const base64Data = await convertirYGuardarArchivoBase64(nombreArchivo);
            resolve(base64Data);
        } catch (error) {
            reject("Error al obtener el archivo en Base64: " + error);
        }

    })
}

const convertirBase64toFile = async (base64Data, nombreArchivo, extension) => {
    return new Promise((resolve, reject) => {
        try {
            if (!base64Data || !nombreArchivo || !extension) {
                return reject("Base64, nombre de archivo o extensión no proporcionados.");
            }

            // Crear la carpeta 'ArchivosConvertidosDeBase64' si no existe
            const folderPath = path.join(__dirname, "../ArchivosConvertidosDeBase64");
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            // Ruta del archivo con nombre y extensión
            let filePath = path.join(folderPath, `${nombreArchivo}.${extension}`);
            let i = 1;

            // Verificar si el archivo ya existe y cambiar el nombre si es necesario
            while (fs.existsSync(filePath)) {
                filePath = path.join(folderPath, `${nombreArchivo}${i}.${extension}`);
                i++;
            }

            // Convertir base64 a buffer
            const buffer = Buffer.from(base64Data, "base64");

            // Escribir el archivo
            fs.writeFile(filePath, buffer, (err) => {
                if (err) return reject("Error al guardar el archivo: " + err);
                console.log("Archivo guardado en:", filePath);
                resolve(filePath);
            });

        } catch (error) {
            reject("Error en el proceso: " + error);
        }
    });
};



module.exports = { obtenerCarros, eliminarUnCarro, aniadirCarro, existeCarro, obtenerUnCarro, guardarArchivosCarros, guardarArchivoUnCarro, subirListaServidor, obtenerBase64, convertirBase64toFile }