"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const TABLE_NAME = "Organizations";
class Organizations extends sequelize_1.Model {
}
Organizations.init({
    orgId: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: config_1.db,
    modelName: TABLE_NAME,
    timestamps: true,
});
exports.default = Organizations;
