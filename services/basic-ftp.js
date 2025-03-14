const ftp = require('basic-ftp');

async function uploadFileToFTP(localFilePath, remoteFilePath, transferMode = 'binary') {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Opcional: logs detallados
    console.log(`el tipo de transferencia que se esta haciendo es ${transferMode}`);
    try {
        // Ajusta la IP/host y el puerto según tu configuración
        await client.access({
            host: "192.168.56.1",  // o la IP/dominio de tu servidor
            user: "ftpuser",
            password: "123",
            secure: true,          // Activa TLS
            port: 21,              // O 990 si usas FTPS implícito
            secureOptions: {
                // Si usas un certificado autofirmado, a menudo necesitas:
                // rejectUnauthorized: false
                // Con un certificado válido (CA reconocida) puedes usar true
                rejectUnauthorized: false
            }
        });

        // Configurar el modo de transferencia
        if (transferMode === 'binary') {
            await client.send('TYPE I');
        } else if (transferMode === 'text') {
            await client.send('TYPE A');
        } else {
            throw new Error('Modo de transferencia no válido. Use "binary" o "text".');
        }

        // Subir el archivo
        await client.uploadFrom(localFilePath, remoteFilePath);
        console.log('File uploaded successfully');
    } catch (err) {
        console.error('Error uploading file:', err);
    } finally {
        client.close(); // Cierra la conexión
    }
}

module.exports = uploadFileToFTP;
