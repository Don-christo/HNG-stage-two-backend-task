"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const users_1 = __importDefault(require("../../models/users"));
const models_1 = require("../../models");
const getUser = async (req, res) => {
    const { id } = req.params;
    const loggedInUserId = req.user.userId;
    try {
        if (id === loggedInUserId) {
            const user = await users_1.default.findOne({ where: { id } });
            if (!user) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: "error",
                    message: "User not found",
                });
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                status: "success",
                message: "User found",
                data: {
                    userId: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                },
            });
        }
        const userOrganizations = await models_1.UserOrganization.findAll({
            where: { userId: loggedInUserId },
        });
        const userOrgsId = userOrganizations.map((userOrganization) => userOrganization.organizationId);
        const user = await users_1.default.findOne({
            where: { id },
            include: {
                model: models_1.UserOrganization,
                where: { organizationId: userOrgsId },
            },
        });
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: "error",
                message: "User not found or you do not have access to this user",
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "success",
            message: "User found",
            data: {
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Error fetching user details",
        });
    }
};
exports.getUser = getUser;
