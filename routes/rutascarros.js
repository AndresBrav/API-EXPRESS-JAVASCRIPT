const express = require('express');
const { addCars, delCars, getCars, getOneCars, updateCars,gcp,gucp } = require('../controllers/controllercarros');


const {validToken} = require("../middelwares/tokenValidator")

const rutasAutos = express.Router();

// rutasAutos.get("/",(req,res) => {
//     console.log("vamos a probar las rutas de los autos");
// })

rutasAutos.get('/', [validToken],getCars);
//rutasAutos.get('/', [validToken],guardarCarrosPdf);

rutasAutos.get('/:id',[validToken], getOneCars);

rutasAutos.delete('/:id',[validToken], delCars);

rutasAutos.post('/',[validToken], addCars);

rutasAutos.put('/:id',[validToken] ,updateCars);

rutasAutos.post('/guardarPdf/lista',[validToken],gcp)

rutasAutos.post('/guardarPdf/lista/:id',[validToken],gucp)

module.exports = rutasAutos;
