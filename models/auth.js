const fs = require('fs');
// const oracledb = require('oracledb');
const { configdb } = require('../config/db.js');
const User = require("../models/modeluser.js");


const bcryptjs = require("bcryptjs");

let usersDB = [];

try {
  // Verifica si el archivo JSON existe antes de leerlo
  if (fs.existsSync("Usuarios.json")) {
    usersDB = JSON.parse(fs.readFileSync("Usuarios.json", "utf-8"));
    console.log("El archivo JSON tiene:", usersDB);

    // Encriptar las contraseñas si no están encriptadas
    // let updated = false;
    usersDB.forEach(user => {
      if (!user.CLAVE.startsWith("$2a$")) { // Evita encriptar una contraseña ya encriptada
        user.CLAVE = bcryptjs.hashSync(user.CLAVE, 10);
        // updated = true;
      }
    });

    // // Solo guarda el JSON si hubo cambios
    // if (updated) {
    //   fs.writeFileSync("Usuarios.json", JSON.stringify(usersDB, null, 2), "utf-8");
    //   console.log("Usuarios actualizados con contraseñas encriptadas.");
    // }
  } else {
    console.error("⚠️ El archivo Usuarios.json no existe.");
  }
} catch (error) {
  console.error("❌ Error al leer Usuarios.json:", error);
}





// const usersDB = [
//   { LOGIN: "USER1", CLAVE: bcryptjs.hashSync("password123", 10), STS: "VIG", TIPO: "admin" },
//   { LOGIN: "USER2", CLAVE: bcryptjs.hashSync("secret456", 10), STS: "VIG", TIPO: "user" },
//   { LOGIN: "USER4", CLAVE: bcryptjs.hashSync("secreta136", 10), STS: "VIG", TIPO: "user" },
//   { LOGIN: "USER3", CLAVE: bcryptjs.hashSync("pass789", 10), STS: "INACTIVO", TIPO: "user" }
// ];

const loginUser = async function (usr) {

  //console.log("Buscando usuario:", usr); //USER4

  // Busca el usuario en el arreglo simulado
  const user = usersDB.find(user => user.LOGIN === usr);
  console.log("el resultado de user es " + user);

  const user1 = await User.findOne({
    where: { login: usr },
    attributes: ["login", "clave", "sts", "tipo"],
    raw: true  // <- Esto hace que devuelva un objeto simple 
  });

  console.log("El usuario que traigo de la base de datos  es ", user1);

  // Simulando la respuesta de  con `rows`
  //return { rows: user1 ? [user1] : [] };
  //return { rows: user ? [user] : [] };
  
  //Para retornar en el formato correcto 
  return { 
    rows: user1 ? [Object.fromEntries(
      Object.entries(user1).map(([key, value]) => [key.toUpperCase(), value])
    )] : [] 
  };



  // let connection, binds, options, result, sql;

  // sql = `SELECT * FROM usuario where login=:1  `;
  // try {
  //   connection = await oracledb.getConnection(configdb);
  //   binds = [
  //     usr
  //   ];
  //   options = {
  //     outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
  //     // extendedMetaData: true,               // get extra metadata
  //     // prefetchRows:     100,                // internal buffer allocation size for tuning
  //     // fetchArraySize:   100                 // internal buffer allocation size for tuning
  //   };

  //   result = await connection.execute(sql, binds, options);
  //   return result;

  // } catch (error) {
  //   throw new Error(error);
  // } finally {
  //   if (connection) {
  //     try { await connection.close(); }
  //     catch (err) {
  //       throw new Error(err.stack);
  //     }
  //   }
  // }
};


module.exports = {
  loginUser
}