import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import Users from "../../models/users";
import { JwtPayload } from "jsonwebtoken";

export const getUser = async (req: JwtPayload, res: Response) => {
  const { id } = req.params;
  try {
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
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Error fetching user details",
    });
  }
};
