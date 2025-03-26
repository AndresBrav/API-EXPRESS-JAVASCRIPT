const fs = require('fs').promises;
const path = require('path');

// Función para convertir un archivo a Base64 y luego decodificarlo a un archivo
const convertirYGuardarArchivoBase64 = async (nombreArchivo) => {
    try {
        // Ruta relativa al archivo
        const localFilePath = path.resolve(__dirname, '../ArchivosGuardados/', nombreArchivo);

        // Leer el archivo de forma asíncrona
        const data = await fs.readFile(localFilePath);

        // Convertir a Base64
        const base64String = data.toString('base64');

        //console.log("codigo del archivo es : ", base64String);
        return base64String;
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return null;
    }
};

module.exports = convertirYGuardarArchivoBase64

// Ejecutar la función
//convertirYGuardarArchivoBase64('../ArchivosGuardados/lista_carros.pdf');
