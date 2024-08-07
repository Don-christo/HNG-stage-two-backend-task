import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { Users, Organizations } from "../../models";
import { JwtPayload } from "jsonwebtoken";
import UserOrganization from "../../models/userOrganization";
import { createOrgSchema } from "../../utilities/validators";

export const getOrganizations = async (req: JwtPayload, res: Response) => {
  const userId = req.user.userId;
  try {
    const organizations = await Organizations.findAll({
      include: {
        model: Users,
        where: { userId },
      },
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: { organizations },
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Error fetching organisations",
    });
  }
};

export const getOrganizationById = async (req: JwtPayload, res: Response) => {
  const { orgId } = req.params;
  const userId = req.user.userId;

  try {
    const organization = await Organizations.findOne({
      where: { orgId },
      include: {
        model: Users,
        where: { userId },
      },
    });

    if (!organization) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message:
          "Organisation not found or you do not have access to this organization",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Organisation found",
      data: organization,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Error fetching organisation details",
    });
  }
};

export const createOrganisation = async (req: JwtPayload, res: Response) => {
  const userId = req.user.userId;
  // const { description, ...rest} = req.body;
  
  try {
    const orgValidated = createOrgSchema.strict().safeParse(req.body);
    if (!orgValidated.success) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: orgValidated.error.issues,
      });
    }

    const { name, description } = orgValidated.data;

    const existingOrganization = await Organizations.findOne({
      where: { name },
    });

    if (existingOrganization) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "error",
        message: "Organisation already exists",
      });
    }

    const orgId = uuidv4();
    const newOrganization = await Organizations.create({
      orgId,
      name,
      description,
    });

    await UserOrganization.create({
      userId,
      organizationId: newOrganization.orgId,
    });

    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Organization created successfully",
      data: newOrganization,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }
};

export const addUserToOrganization = async (req: JwtPayload, res: Response) => {
  const { userId } = req.body;
  const { orgId } = req.params;

  try {
    const user = await Users.findByPk(userId);
    const organization = await Organizations.findByPk(orgId);

    if (!user || !organization) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "User or organization not found",
      });
    }

    const existingMembership = await UserOrganization.findOne({
      where: {
        userId: user.userId,
        organizationId: organization.orgId,
      },
    });

    if (existingMembership) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "User is already a member of the organization",
      });
    }

    await UserOrganization.create({
      userId: user.userId,
      organizationId: organization.orgId,
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "User added to organization successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Error adding user to organization",
    });
  }
};
