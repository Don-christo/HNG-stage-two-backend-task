import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { PasswordHarsher } from "../../utilities/helpers";
import Users from "../../models/users";
import { Op } from "sequelize";
import _, { toLower } from "lodash";
import Organizations from "../../models/organizations";
import * as jwt from "jsonwebtoken";
import { ENV } from "../../config";
import { loginSchema, registerSchema } from "../../utilities/validators";
import {
  ACCESS_TOKEN,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
} from "../../constants";
import UserOrganization from "../../models/userOrganization";

export const generateToken = (user: any) => {
  const payload = { userId: user.userId, email: user.email };
  return jwt.sign(payload, ENV.APP_SECRET as string, {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  });
};
export const registerUser = async (req: Request, res: Response) => {
  try {
    const userValidated = registerSchema.strict().safeParse(req.body);
    if (!userValidated.success) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: "Validation error",
        error: userValidated.error.issues,
      });
    }
    const { firstName, lastName, email, password, phone } = userValidated.data;
    const newEmail = email.trim().toLowerCase();
    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [{ email: newEmail }, { phone }],
      },
    });

    if (!existingUser) {
      const hashedPassword = await PasswordHarsher.hash(password);
      const userId = uuidv4();

      const newUser = await Users.create({
        userId,
        firstName: toLower(firstName),
        lastName: toLower(lastName),
        email: newEmail,
        password: hashedPassword,
        phone,
      });

      const orgId = uuidv4();
      const orgName = `${firstName}'s Organisation`;
      const newOrganization = await Organizations.create({
        orgId: orgId,
        name: orgName,
        description: "",
      });

      await UserOrganization.create({
        userId: newUser.userId,
        organizationId: newOrganization.orgId,
      });

      const token = generateToken(newUser);

      return res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "Registration successful",
        data: {
          accessToken: token,
          user: _.pick(newUser, [
            "userId",
            "firstName",
            "lastName",
            "email",
            "phone",
          ]),
        },
      });
    }
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: "error",
      message: "User or phone already exists",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validationResult = loginSchema.strict().safeParse(req.body);

    if (!validationResult.success) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: validationResult.error.issues,
      });
    }

    const { email, password } = validationResult.data;

    const confirmUser = await Users.findOne({
      where: { email },
    });

    if (confirmUser) {
      const confirmPassword = await PasswordHarsher.compare(
        password,
        confirmUser.password
      );

      if (confirmPassword) {
        const accessToken = generateToken(confirmUser);

        res.cookie(ACCESS_TOKEN, accessToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: ENV.IS_PROD,
        });

        return res.status(StatusCodes.OK).json({
          status: "success",
          message: "Login successful",
          data: {
            accessToken,
            user: _.pick(confirmUser.dataValues, [
              "userId",
              "firstName",
              "lastName",
              "email",
              "phone",
            ]),
          },
        });
      }
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid credentials!",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }
};
