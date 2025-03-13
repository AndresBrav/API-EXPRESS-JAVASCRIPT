const Carro = require("../models/modelcarro");
const PDFDocument = require("pdfkit");   //biblioteca para guardar pdf
const fs = require("fs");
const uploadFileToFTP = require('./basic-ftp') //metodo para subir al servidor
const path = require('path');

/************CRUD************ */
const obtenerCarros = async () => {
    const carro = await Carro.findAll()

    //guardarPdfCarros(carro); // llamara a generar un pdf
    //guardarPdfCarros()
    return carro;
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

obtenerUnCarro = async (req, res) => {
    const { id } = req.params;
    const unCarro = await Carro.findByPk(id);

    //guardarPdfUnCarro(unCarro)

    if (unCarro) {
        return unCarro
    } else {
        return null
    }

}

/***********Seccion de pdf**************/

const guardarPdfCarros = async () => {
    const carro = await Carro.findAll()
    const listaCarros = carro;

    // Crear una carpeta 'pdfs' si no existe
    const pdfFolderPath = path.join(__dirname, "../pdfs");
    if (!fs.existsSync(pdfFolderPath)) { //verificamos si la carpeta existe
        fs.mkdirSync(pdfFolderPath); //creamos la carpeta
    }

    // Ruta donde se guardará el PDF
    const pdfFilePath = path.join(pdfFolderPath, "lista_carros.pdf");

    // let i = 1;
    // // Verificar si el archivo ya existe y cambiar el nombre si es necesario
    // while (fs.existsSync(pdfFilePath)) {
    //     pdfFilePath = path.join(pdfFolderPath, `lista_carros${i}.pdf`); //aumentaremos un indice si ya existe
    //     i++;
    // }


    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfFilePath); //crea un flujo de escritura 
    doc.pipe(writeStream); //Conecta el documento PDF al flujo de escritura

    // Título del documento
    doc.fontSize(20).text("Lista de Carros", { align: "center" });
    doc.moveDown(); //agrega un pequeño espacio

    // Agregar los carros al PDF
    listaCarros.forEach((carro, index) => {
        doc.fontSize(14).text(`${index + 1}. ID: ${carro.id} - Nombre: ${carro.nombre} - Descripcion: ${carro.descripcion} - Precio: ${carro.precio} - Stock:${carro.stock}`);
        doc.moveDown(0.5);
    });

    // Finalizar el documento
    doc.end();

    // Esperar a que termine de escribir el archivo
    writeStream.on("finish", () => {
        console.log("PDF guardado en:", pdfFilePath);
        //res.json({ msg: "PDF generado con éxito", path: pdfFilePath });
    });

    writeStream.on("error", (err) => {
        console.error("Error al guardar el PDF:", err);
        //res.status(500).json({ msg: "Error al generar el PDF" });
    });
}


///guarda el pdf en la carpeta ../pdfs/Carro.pdf
const guardarPdfUnCarro = async (id) => {
    const carro = await Carro.findByPk(id);
    const existe = await existeCarro(id)
    console.log(`el carro existe ? ${existe}`);
    try {
        if (existe) {
            // Crear una carpeta 'pdfs' si no existe
            const pdfFolderPath = path.join(__dirname, "../pdfs");
            if (!fs.existsSync(pdfFolderPath)) { //verificamos si la carpeta existe
                fs.mkdirSync(pdfFolderPath); //creamos la carpeta
            }

            // Ruta donde se guardará el PDF
            const pdfFilePath = path.join(pdfFolderPath, "Carro.pdf");
            // let i = 1;

            // // Verificar si el archivo ya existe y cambiar el nombre si es necesario
            // while (fs.existsSync(pdfFilePath)) {
            //     pdfFilePath = path.join(pdfFolderPath, `Carro${i}.pdf`); //aumentaremos un indice si ya existe
            //     i++;
            // }

            // Crear un nuevo documento PDF
            const doc = new PDFDocument();
            const writeStream = fs.createWriteStream(pdfFilePath); //crea un flujo de escritura 
            doc.pipe(writeStream); //Conecta el documento PDF al flujo de escritura

            // Título del documento
            doc.fontSize(20).text("Detalles del Carro", { align: "center" });
            doc.moveDown(); //agrega un pequeño espacio

            //agregar carro al pdf
            doc.fontSize(14).text(`ID: ${carro.id} - Nombre: ${carro.nombre} - Descripcion: ${carro.descripcion} - Precio: ${carro.precio} - Stock:${carro.stock}`)


            // Finalizar el documento
            doc.end();

            // Esperar a que termine de escribir el archivo
            writeStream.on("finish", () => {
                console.log("PDF guardado en:", pdfFilePath);
                //res.json({ msg: "PDF generado con éxito", path: pdfFilePath });
            });

            writeStream.on("error", (err) => {
                console.error("Error al guardar el PDF:", err);
                //res.status(500).json({ msg: "Error al generar el PDF" });
            });

        }
        else {
            console.log("el carro que estas buscando no existe");
        }
    }
    catch (error) {
        console.log(error);
        //res.end();
    }

    //const carro = await Carro.findByPk(id);


}

/*************Subir al servidor ********* */
const subirListaServidor = async () => {
    // Ruta relativa al archivo
    const localFilePath = '../pdfs/lista_carros.pdf';

    // Convertir la ruta relativa a una ruta absoluta
    const absoluteFilePath = path.resolve(__dirname, localFilePath);
    console.log("la ruta absoluta es : " + absoluteFilePath);

    const remoteFilePath = '/lista_carros.pdf';
    const transferMode = 'binary';

    //uploadFileToFTP(localFilePath, remoteFilePath, transferMode);
    await uploadFileToFTP(absoluteFilePath, remoteFilePath, transferMode);
}

const SubirCarroServidor = async () => {

    try {
        // Ruta relativa al archivo
        const localFilePath = '../pdfs/Carro.pdf';

        // Convertir la ruta relativa a una ruta absoluta
        const absoluteFilePath = path.resolve(__dirname, localFilePath);
        console.log("la ruta absoluta es : " + absoluteFilePath);

        const remoteFilePath = '/Carro.pdf';
        const transferMode = 'binary';

        //uploadFileToFTP(localFilePath, remoteFilePath, transferMode);
        await uploadFileToFTP(absoluteFilePath, remoteFilePath, transferMode);
    }
    catch (error) {
        console.log("no existe el carro en el directorio");
    }

}






module.exports = { obtenerCarros, eliminarUnCarro, aniadirCarro, existeCarro, obtenerUnCarro, guardarPdfCarros, guardarPdfUnCarro, subirListaServidor, SubirCarroServidor }