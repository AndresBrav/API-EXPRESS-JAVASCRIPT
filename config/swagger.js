const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

//Metadata info about out API
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Api de Cobranza - Comteco", 
            version: "2.0.0"
         }
    },
    apis: [
        "./routes/auth.js", 
    ]
    
};

// Docs en JSON format
const swaggerSpec = swaggerJSDoc(options);

//Function to setup out docs
const swaggerDocs = (app, port) => {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));   
    app.get('/api/docs/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    })
}

module.exports = {swaggerDocs}