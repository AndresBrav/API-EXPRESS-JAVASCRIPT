const { response, request } = require('express');
const authUser = require('../services/auth');


const loginUser = async (req = request, res = response) => {
    console.log("Ingreso a Autenticación");

    const data = req.body
    let resp = await authUser.loginUser(data);

    if (resp instanceof Error) { throw resp }
    else { res.status(resp.statuscode).json(resp.response()).end() }

}


module.exports = {
    loginUser
}