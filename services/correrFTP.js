const uploadFileToFTP = require('./basic-ftp')
const path = require('path');

// Ruta relativa al archivo
const localFilePath = '../pdfs/lista_carros.pdf';

// Convertir la ruta relativa a una ruta absoluta
const absoluteFilePath = path.resolve(__dirname, localFilePath);

//const localFilePath = 'C:/Users/ASUS/Desktop/Comteco Proyectos/API-EXPRESS-ORACLEDB-VMIA/pdfs/lista_carros.pdf';
//const localFilePath ='../pdfs/lista_carros.pdf'
const remoteFilePath = '/lista_carros.pdf';
const transferMode = 'binary';

//uploadFileToFTP(localFilePath, remoteFilePath, transferMode);
uploadFileToFTP(absoluteFilePath, remoteFilePath, transferMode);