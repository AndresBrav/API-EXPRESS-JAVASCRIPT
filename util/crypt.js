const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const newJWT = (u, t, tiempo='1h') => {

    const payload =  {u, t};
    return new Promise ((resolve, reject) => {

        jwt.sign(payload, process.env.SECRETKEY, {expiresIn: tiempo}, (err, token) => {
            if(err)
            { reject(new Error (err.stack)); }
            else
            { resolve(token); }
            }
        );
    });
}


const validJWT = (token) => {
    try{
        const { iat, exp, ...data } = jwt.verify(token, process.env.SECRETKEY);
        return data;        
    }catch(error)
    {
        throw new Error (error.stack)
    }    
}

const newPass = (passIN) => {
    try{
        const salt = bcryptjs.genSaltSync();
        return bcryptjs.hashSync( passIN, salt );
    }catch(error)
    {
        throw new Error (error.stack)
    }
}

/**
 * Validad el password con el almacenado en la base de datos
 * @param {*} passIN cadena ingresada como password
 * @param {*} passDB valor de DB para comparar, en hash
 * @returns true o false
 */
const validPass = (passIN, passDB) => {
    try{
        return bcryptjs.compareSync(passIN, passDB);
    }catch(error)
    {
        throw new Error (error.stack)
    }    
}

module.exports = {
    newJWT,
    validJWT,
    newPass,
    validPass
}
