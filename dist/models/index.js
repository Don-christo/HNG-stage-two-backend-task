"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrganization = exports.Organizations = exports.Users = void 0;
const users_1 = __importDefault(require("./users"));
exports.Users = users_1.default;
const organizations_1 = __importDefault(require("./organizations"));
exports.Organizations = organizations_1.default;
const userOrganization_1 = __importDefault(require("./userOrganization"));
exports.UserOrganization = userOrganization_1.default;
// Define associations
users_1.default.belongsToMany(organizations_1.default, {
    through: userOrganization_1.default,
    foreignKey: "userId",
});
organizations_1.default.belongsToMany(users_1.default, {
    through: userOrganization_1.default,
    foreignKey: "organizationId",
});
