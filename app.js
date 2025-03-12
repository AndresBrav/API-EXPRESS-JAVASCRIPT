require("dotenv").config();
const OraDB = require("./config/instantOra");
const ApiServer = require("./config/apiServer");

// OraDB.iniOra();

const apiServer = new ApiServer();
apiServer.listen();

