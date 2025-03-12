const uploadFileToFTP = require('./basic-ftp')

const localFilePath = 'D:/2024 Semestre2/Grabaciones/Proyecto 3.mp4';
const remoteFilePath = '/proy 3.mp4';
const transferMode = 'binary';

uploadFileToFTP(localFilePath, remoteFilePath, transferMode);