"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbconfig_1 = require("./dbconfig");
const testConnection = async () => {
    try {
        await dbconfig_1.db.authenticate();
        console.log("Connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
testConnection();
