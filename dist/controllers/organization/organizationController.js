"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToOrganization = exports.createOrganisation = exports.getOrganizationById = exports.getOrganizations = void 0;
const http_status_codes_1 = require("http-status-codes");
const uuid_1 = require("uuid");
const models_1 = require("../../models");
const userOrganization_1 = __importDefault(require("../../models/userOrganization"));
const validators_1 = require("../../utilities/validators");
const getOrganizations = async (req, res) => {
    const userId = req.user.userId;
    try {
        const organizations = await models_1.Organizations.findAll({
            include: {
                model: models_1.Users,
                where: { id: userId },
            },
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "success",
            message: "Organisations retrieved successfully",
            data: { organizations },
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Error fetching organisations",
        });
    }
};
exports.getOrganizations = getOrganizations;
const getOrganizationById = async (req, res) => {
    const { orgId } = req.params;
    const userId = req.user.userId;
    try {
        const organization = await models_1.Organizations.findOne({
            where: { orgId },
            include: {
                model: models_1.Users,
                where: { id: userId },
            },
        });
        if (!organization) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: "error",
                message: "Organisation not found or you do not have access to this organization",
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "success",
            message: "Organisation found",
            data: organization,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Error fetching organisation details",
        });
    }
};
exports.getOrganizationById = getOrganizationById;
const createOrganisation = async (req, res) => {
    const userId = req.user.userId;
    // const { description, ...rest} = req.body;
    try {
        const orgValidated = validators_1.createOrgSchema.strict().safeParse(req.body);
        if (!orgValidated.success) {
            return res.status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: orgValidated.error.issues,
            });
        }
        const { name, description } = orgValidated.data;
        const existingOrganization = await models_1.Organizations.findOne({
            where: { name },
        });
        if (existingOrganization) {
            return res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                status: "error",
                message: "Organisation already exists",
            });
        }
        const orgId = (0, uuid_1.v4)();
        const newOrganization = await models_1.Organizations.create({
            orgId,
            name,
            description,
        });
        await userOrganization_1.default.create({
            userId,
            organizationId: newOrganization.orgId,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: "success",
            message: "Organization created successfully",
            data: newOrganization,
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
        });
    }
};
exports.createOrganisation = createOrganisation;
const addUserToOrganization = async (req, res) => {
    const { userId } = req.body;
    const { orgId } = req.params;
    try {
        const user = await models_1.Users.findByPk(userId);
        const organization = await models_1.Organizations.findByPk(orgId);
        if (!user || !organization) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: "error",
                message: "User or organization not found",
            });
        }
        const existingMembership = await userOrganization_1.default.findOne({
            where: {
                userId: user.id,
                organizationId: organization.orgId,
            },
        });
        if (existingMembership) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: "error",
                message: "User is already a member of the organization",
            });
        }
        await userOrganization_1.default.create({
            userId: user.id,
            organizationId: organization.orgId,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "success",
            message: "User added to organization successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Error adding user to organization",
        });
    }
};
exports.addUserToOrganization = addUserToOrganization;
