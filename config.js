require('dotenv').config();

const config = {};

config.host = process.env.HOST;
config.authKey = process.env.AUTH_KEY;
config.databaseID = "ToDoList";
config.containerid = "Items";

if(config.host.includes("//localhost")){
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

}

module.exports = config;