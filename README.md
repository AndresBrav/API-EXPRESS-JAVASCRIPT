# Servicio resfull
Plantilla para implementar servicios resfull utilizando: 
- Express para crear los servicios
- Oracledb para conexión a base de datos
- Swagger para la documentación

La plantilla considera el manejo de errores, capturando los mismos desde as capas modelo, servicio, controlador y ruta, todo capturando en un manejador de errores (middelware) de las respuestas personalizadas error y success 

Configuración env
```sh
ORAPATH = path_instantclient
API_PORT = xxxx
SECRETKEY = clave_para_generar_jwt
PRODUCTION = 0
NODE_ENV=production node app
```


## Instalación

Instala dependencies and devDependencies y inicia el servidor

```sh
npm update
node app
```

