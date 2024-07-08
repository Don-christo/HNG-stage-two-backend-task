import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import Users from "../../models/users";
import { JwtPayload } from "jsonwebtoken";
import { UserOrganization } from "../../models";

export const getUser = async (req: JwtPayload, res: Response) => {
  const { id } = req.params;
  const loggedInUserId = req.user.userId;

  try {
    if (id === loggedInUserId) {
      const user = await Users.findOne({ where: { id } });
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: "error",
          message: "User not found",
        });
      }
      res.status(StatusCodes.OK).json({
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
    const userOrganizations = await UserOrganization.findAll({
      where: { userId: loggedInUserId },
    });
    const userOrgsId = userOrganizations.map(
      (userOrganization) => userOrganization.organizationId
    );
    const user = await Users.findOne({
      where: { id },
      include: {
        model: UserOrganization,
        where: { organizationId: userOrgsId },
      },
    });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "User not found or you do not have access to this user",
      });
    }
    res.status(StatusCodes.OK).json({
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
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Error fetching user details",
    });
  }
};
