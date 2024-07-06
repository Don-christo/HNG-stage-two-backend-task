import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import Organizations from "../../models/organizations";
import Users from "../../models/users";
import { JwtPayload } from "jsonwebtoken";
import UserOrganization from "../../models/userOrganization";

export const getOrganisations = async (req: JwtPayload, res: Response) => {
  const userId = req.user.userId;
  try {
    const organisations = await Organizations.findAll({
      include: {
        model: Users,
        where: { id: userId },
      },
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: { organisations },
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Error fetching organisations",
    });
  }
};

export const getOrganisationById = async (req: JwtPayload, res: Response) => {
  const { orgId } = req.params;
  try {
      const organisation = await Organizations.findOne({
        where: { orgId },
        include: Users,
      });
    if (!organisation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "Organisation not found",
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Organisation found",
      data: organisation,
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
  const { name, description } = req.body;
  try {
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
      message: "Organisation created successfully",
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

export const addUserToOrganization = async (req: Request, res: Response) => {
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

    
    await UserOrganization.create({
      userId: user.id,
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
