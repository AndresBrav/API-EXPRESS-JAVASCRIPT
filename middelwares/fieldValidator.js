const { validationResult } = require('express-validator');
const resError = require("../util/resError");
const {respCode} = require("../util/httpResponse")

const validation = (req, res, next ) => {
    
    const errors = validationResult(req);
   
    if(!errors.isEmpty())
    {
        const msg = errors
            .array()
            .map((er) => `${er.path}: ${er.msg} `)
            //.join(', ');

        const newError = new resError(respCode.BAD_REQUEST, [ ...new Set(msg) ], null);
        return res.status(newError.statuscode).json(newError.response()).end()    
    }

    next();
}



module.exports = {
    validation
}
