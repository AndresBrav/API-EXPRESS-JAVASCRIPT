const express = require('express');
const cors = require('cors');
const erroHandler = require('../middelwares/errorHandler');
const { swaggerDocs } = require('./swagger');
const db = require("../db/conexion")


class ApiServer {

    constructor() {
        this.app = express();
        this.port = process.env.API_PORT;

        this.authClientePath = '/api/auth';

        this.carrospath='/carros';

        this.middlewares();

        this.routes();
        this.dbConnet(); //conexion a la base de datos
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }


    async dbConnet() {
        //conexion a la base de datos

        try {
            await db.authenticate();
            console.log("base de datos conectada");
        } catch (error) {
            console.log(error);
            console.log('error al conectarse en la base de datos');
        }
    }

    routes() {
        this.app.use(this.authClientePath, require('../routes/auth'));

        //ruta para ir a los autos
        this.app.use(this.carrospath,require('../routes/rutascarros'))


        this.app.use(erroHandler);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Api rest iniciado, puerto', this.port);
            swaggerDocs(this.app, this.port);
        });
    }
}

module.exports = ApiServer;
