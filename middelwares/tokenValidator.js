const { response, request } = require('express');
const resError = require("../util/resError");
const Crypt = require("../util/crypt");
const {respCode, respPhrase} = require("../util/httpResponse")

const validToken = (req = request, res = response, next) => {

    const token = req.header('x-api-token');

    try{

        req.usrT = Crypt.validJWT(token);
        next();

    }catch(error)
    {
        const newError = new resError(respCode.UNAUTHORIZED, respPhrase.UNAUTHORIZED.tokenValidator1, null);
        return res.status(newError.statuscode).json(newError.response()).end()            
    }    
}


module.exports = {
    validToken
}