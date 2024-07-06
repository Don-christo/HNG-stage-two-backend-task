import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { PasswordHarsher } from "../utilities/helpers";
import Users from "../models/users";
import { Op } from "sequelize";
import _, { toLower } from "lodash";
import Organizations from "../models/organization";
import * as jwt from "jsonwebtoken";
import { ENV } from "../config";
import { loginSchema, registerSchema } from "../utilities/validators";
import { ACCESS_TOKEN, JWT_ACCESS_TOKEN_EXPIRATION_TIME } from "../constants";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const userValidated = registerSchema.strict().safeParse(req.body);
    if (!userValidated.success) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: userValidated.error.issues,
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
      const id = uuidv4();

      const newUser = await Users.create({
        id,
        firstName: toLower(firstName),
        lastName: toLower(lastName),
        email: newEmail,
        password: hashedPassword,
        phone,
      });

      const orgName = `${firstName}'s Organisation`;
      await Organizations.create({
        id: uuidv4(),
        userId: newUser.id,
        name: orgName,
        description: "",
      });

      return res.status(StatusCodes.CREATED).json({
        message: "User created successfully",
        data: _.pick(newUser, ["id", "firstName", "lastName", "email"]),
      });
    }
    return res.status(StatusCodes.CONFLICT).json({
      message: "User already exists",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Registration unsuccessful",
      error,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validationResult = loginSchema.strict().safeParse(req.body);

    if (!validationResult.success) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
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
        const payload = { id: confirmUser.id };

        const accessToken = jwt.sign(payload, ENV.APP_SECRET as string, {
          expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        });

        res.cookie(ACCESS_TOKEN, accessToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: ENV.IS_PROD,
        });

        return res.status(StatusCodes.OK).json({
          message: "User logged in successfully",
          data: _.pick(confirmUser.dataValues, ["id", "firstName", "lastName"]),
          token: accessToken,
        });
      }
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid credentials!",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Login unsuccessful",
      error,
    });
  }
};
