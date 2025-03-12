const respPhrase = {
    // Successful - 2xx   
    OK: 
    {
        val: "OK",
        auth1: "Acceso autorizado"
    },
    CREATED: 
    {
        val: "Creado" 
    },
    ACCEPTED: 
    {
        val: "Aceptado"
    },
    NO_CONTENT: 
    {
        val: "Sin Contenido"
    },
    
    // Client Error - 4xx 
    BAD_REQUEST: 
    {
        val: "Solicitud Incorrecta"
    },
    UNAUTHORIZED: 
    {
        val: "Sin Autorización",
        auth1: "Usuario o contraseña, incorrectos",
        auth2: "Cuenta inactiva",
        tokenValidator1: "Token invalido"
    },
    PAYMENT_REQUIRED: 
    {
        val: "Pago Requerido"
    },
    FORBIDDEN: 
    {
        val: "Prohibido el Acceso"
    },
    NOT_FOUND: 
    {
        val: "No Encontrado"
    },
    METHOD_NOT_ALLOWED: 
    {
        val: "Método no Permitido"
    },
    NOT_ACCEPTABLE: 
    {
        val: "No Aceptado"
    },
    REQUEST_TIMEOUT: 
    {
        val: "Tiempo Excedido"
    },
    
    // Server Error - 5xx
    INTERNAL_SERVER_ERROR: 
    {
        val: "Error Interno del Servidor",
        errorHandler1: "Consulte con el administrador"
    },
    NOT_IMPLEMENTED: 
    {
        val: "No Implementado"
    },
    SERVICE_UNAVAILABLE: 
    {
        val: "Servicio no Disponible",
    }                        
                        
};

const respCode = {
    // Successful - 2xx
    /**
    * OK: 200
    */
    OK: 200,
    /**
    * CREATED: 201
    */
    CREATED: 201,
    /**
    * ACCEPTED: 202
    */
    ACCEPTED: 202,
    /**
    * NO_CONTENT: 204
    */
    NO_CONTENT: 204,

    // Client Error - 4xx 
    /**
    * BAD_REQUEST: 400
    */
    BAD_REQUEST: 400,
    /**
    * UNAUTHORIZED: 401
    */
    UNAUTHORIZED: 401,
    /**
    * PAYMENT_REQUIRED: 402
    */    
    PAYMENT_REQUIRED: 402,
    /**
    * FORBIDDEN: 403
    */
    FORBIDDEN: 403,
    /**
    * NOT_FOUND: 404
    */
    NOT_FOUND: 404,
    /**
    * METHOD_NOT_ALLOWED: 405
    */
    METHOD_NOT_ALLOWED: 405,
    /**
    * NOT_ACCEPTABLE: 406
    */
    NOT_ACCEPTABLE: 406,
    /**
    * REQUEST_TIMEOUT: 408
    */    
    REQUEST_TIMEOUT: 408,
    
    // Server Error - 5xx
    /**
    * INTERNAL_SERVER_ERROR: 500
    */    
    INTERNAL_SERVER_ERROR: 500,
    /**
    * NOT_IMPLEMENTED: 501
    */
    NOT_IMPLEMENTED: 501,
    /**
    * SERVICE_UNAVAILABLE: 503
    */
    SERVICE_UNAVAILABLE: 503
};


module.exports = {
    respCode, 
    respPhrase
}