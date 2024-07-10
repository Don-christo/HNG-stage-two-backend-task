"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/userOrganization.ts
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const users_1 = __importDefault(require("./users"));
const organizations_1 = __importDefault(require("./organizations"));
const TABLE_NAME = "UserOrganizations";
class UserOrganization extends sequelize_1.Model {
}
UserOrganization.init({
    userId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: users_1.default,
            key: "id",
        },
    },
    organizationId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: organizations_1.default,
            key: "orgId",
        },
    },
}, {
    sequelize: config_1.db,
    modelName: TABLE_NAME,
    timestamps: true,
});
exports.default = UserOrganization;
