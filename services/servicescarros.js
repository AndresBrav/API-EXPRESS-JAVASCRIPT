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





// const guardarArchivoUnCarro = async (id, TipoTransferencia, tipoGuardado) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             console.log("el tipo de guardado es: " + tipoGuardado);
//             const carro = await Carro.findByPk(id);
//             const existe = await existeCarro(id)
//             //console.log(`el carro existe ? ${existe}`);

//             if (tipoGuardado === "pdf") {
//                 try {

//                     let nombreDelArchivo = "";

//                     if (existe) {
//                         // Crear una carpeta 'pdfs' si no existe
//                         const pdfFolderPath = path.join(__dirname, "../ArchivosGuardados");
//                         if (!fs.existsSync(pdfFolderPath)) { //verificamos si la carpeta existe
//                             fs.mkdirSync(pdfFolderPath); //creamos la carpeta
//                         }

//                         // Ruta donde se guardará el PDF
//                         let pdfFilePath = path.join(pdfFolderPath, "Carro.pdf");
//                         let i = 1;

//                         let nombreArchivo = "Carro.pdf";

//                         // Verificar si el archivo ya existe y cambiar el nombre si es necesario
//                         while (fs.existsSync(pdfFilePath)) {
//                             pdfFilePath = path.join(pdfFolderPath, `Carro${i}.pdf`); //aumentaremos un indice si ya existe
//                             nombreArchivo = `Carro${i}.pdf`
//                             i++;
//                         }

//                         // Crear un nuevo documento PDF
//                         const doc = new PDFDocument();
//                         const writeStream = fs.createWriteStream(pdfFilePath); //crea un flujo de escritura 
//                         doc.pipe(writeStream); //Conecta el documento PDF al flujo de escritura

//                         // Título del documento
//                         doc.fontSize(20).text("Detalles del Carro", { align: "center" });
//                         doc.moveDown(); //agrega un pequeño espacio

//                         //agregar carro al pdf
//                         doc.fontSize(14).text(`ID: ${carro.id} - Nombre: ${carro.nombre} - Descripcion: ${carro.descripcion} - Precio: ${carro.precio} - Stock:${carro.stock}`)


//                         // Finalizar el documento
//                         doc.end();


//                         // Esperar a que termine de escribir el archivo
//                         writeStream.on("finish", async() => {
//                             console.log("PDF guardado en:", pdfFilePath);
//                             nombreDelArchivo = nombreArchivo;
//                             const variableBase64 = await convertirYGuardarArchivoBase64(nombreDelArchivo);
//                             console.log("el nombre del archivo es: " + nombreDelArchivo);
//                             resolve(variableBase64);
//                         });

//                         writeStream.on("error", (err) => {
//                             console.error("Error al guardar el PDF:", err);
//                         });


//                     }
//                     else {
//                         console.log("el carro que estas buscando no existe");
//                     }
//                 }
//                 catch (error) {
//                     console.log(error);
//                     //res.end();
//                 }
//             }
//             else {
//                 if (tipoGuardado === "txt") {
//                     // Crear una carpeta 'txts' si no existe
//                     const txtFolderPath = path.join(__dirname, "../ArchivosGuardados");
//                     if (!fs.existsSync(txtFolderPath)) {
//                         fs.mkdirSync(txtFolderPath);
//                     }

//                     // Ruta donde se guardará el archivo .txt
//                     let txtFilePath = path.join(txtFolderPath, "Carro.txt");
//                     let i = 1;

//                     let nombreArchivo = "Carro.txt";

//                     // Verificar si el archivo ya existe y cambiar el nombre si es necesario
//                     while (fs.existsSync(txtFilePath)) {
//                         txtFilePath = path.join(txtFolderPath, `Carro${i}.txt`);
//                         nombreArchivo = `Carro${i}.txt`;
//                         i++;
//                     }

//                     // Crear el contenido del archivo .txt
//                     let fileContent = "Detalle de Carro\n\n";

//                     // Agregar los carros al archivo .txt

//                     fileContent += ` ID: ${carro.id} - Nombre: ${carro.nombre} - Descripcion: ${carro.descripcion} - Precio: ${carro.precio} - Stock: ${carro.stock}\n`;


//                     // Escribir el contenido en el archivo .txt
//                     fs.writeFile(txtFilePath, fileContent, (err) => {
//                         if (err) {
//                             console.error("Error al guardar el archivo .txt:", err);
//                         } else {
//                             console.log("Archivo .txt guardado en:", txtFilePath);
//                         }
//                     });

//                 }
//             }


//         } catch (error) {
//             reject("Error en el proceso: " + error);
//         }


//     });

// }




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


module.exports = { obtenerCarros, eliminarUnCarro, aniadirCarro, existeCarro, obtenerUnCarro, guardarArchivosCarros, guardarArchivoUnCarro, subirListaServidor }