const { Router } = require('express');
const { loginUser } = require('../controllers/auth');
const { validToken } = require('../middelwares/tokenValidator');
const { validateLogin } =  require('../validators/vAuth')
const tryCatch = require("../util/tryCatch");
const db = require("../db/conexion")

const router = Router();

/**
 * @openapi
 * '/api/auth/login':
 *  post:
 *     tags:
 *     - auth
 *     summary: Autenticación de usuarios
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - usuario
 *              - password
 *            properties:
 *              usuario:
 *                type: string
 *                default: user
 *              password:
 *                type: string
 *                default: pass
 *     responses:
 *      200:
 *        description: Ok
 *      500:
 *        description: Error interno
 */
router.post('/login', /* [validateLogin] */  tryCatch(loginUser));

// router.get('/autos',(req,res) => {
//     console.log("hola autos");
//     res.end()
// })


// const conexion = async () => {
//     try {
//         await db.authenticate();
//         console.log("base de datos conectada");
//     } catch (error) {
//         console.log(error);
//         console.log('error al conectarse en la base de datos');
//     }
// }

// conexion() //comprobar la conexion

// Ejm. uso del middelware validToken
//router.get('/', [validToken, validateLogin] , tryCatch(loginUser));

module.exports = router;