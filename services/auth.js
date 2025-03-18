const authUser = require('../models/auth');
const resError = require("../util/resError");
const resSuccess = require("../util/resSuccess");
const Crypt = require("../util/crypt");
const { respCode, respPhrase } = require("../util/httpResponse");
const { password } = require('../config/db');

const loginUser = async (data) => {
  try {
    console.log("lo que trae dato es"+data.usuario.toUpperCase()); //come from postman USER4
    
    //*************- Llamar al modelo de base de datos *************//
    const result = await authUser.loginUser(data.usuario.toUpperCase());

    console.log("Resultado de loginUser es:", result);

    //**************/ Realizar lógica de negocio adicional sobre la informacion devuelta *************//
    if (result.rows.length == 1) {
      console.log("Contraseña ingresada:", data.password);
      console.log("Contraseña almacenada:", result.rows[0].CLAVE);


      const verifPassword = Crypt.validPass(data.password, result.rows[0].CLAVE);

      console.log("Resultado de validación de contraseña:", verifPassword)

      if (verifPassword) {
        if (result.rows[0].STS == 'VIG') {
          const token = await Crypt.newJWT(result.rows[0].LOGIN, result.rows[0].TIPO);
          const data = {
            token: token
          }
          return new resSuccess(respCode.OK, respPhrase.OK.auth1, data);
        }
        else return new resError(respCode.UNAUTHORIZED, respPhrase.UNAUTHORIZED.auth2, null);
      }
      else return new resError(respCode.UNAUTHORIZED, respPhrase.UNAUTHORIZED.auth1, null);
    }
    else return new resError(respCode.UNAUTHORIZED, respPhrase.UNAUTHORIZED.auth1, null);
  } catch (error) {
    return error
  }
};


module.exports = {
  loginUser,
  // registerUser
}