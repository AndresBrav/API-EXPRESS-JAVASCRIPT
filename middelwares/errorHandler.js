const resError = require("../util/resError");
const {respCode, respPhrase} = require("../util/httpResponse")

const erroHandler = (err, req, res, netx) => {

    if(err instanceof resError)
    {
        return res.status(err.statuscode).json(err.response()).end()    
    }
    else {
        //let msg = "Consulte con el administrador";
        console.log(err);
        const newError = new resError(respCode.INTERNAL_SERVER_ERROR, respPhrase.INTERNAL_SERVER_ERROR.errorHandler1, err.stack);
        return res.status(newError.statuscode).json(newError.response()).end()    
    }

}

module.exports = erroHandler;