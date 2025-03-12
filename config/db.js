const configdb = {
    user: "db",
    password: "pass",
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "127.0.0.1/db1", 
    externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false 
};


module.exports = {
    configdb
}