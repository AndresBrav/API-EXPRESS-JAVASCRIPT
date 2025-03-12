const { check } = require('express-validator') 
const {validation} = require('../middelwares/fieldValidator')


const validateLogin = [ 
    check('usuario', 'Campo requerido')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .withMessage('Debe ser cadena'),
    check('password', 'Campo requerido')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Debe ser cadena'),
    (req, res, next) => {
        validation(req, res, next)
    }
]


const registerUser = [ 
    check('usuario', 'Campo requerido')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .withMessage('Debe ser cadena'),
    check('password', 'Campo requerido')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Debe ser cadena'),
    (req, res, next) => {
        validation(req, res, next)
    }
]

module.exports = { 
    validateLogin,
    registerUser
 }