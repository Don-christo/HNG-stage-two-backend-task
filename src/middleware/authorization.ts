import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ENV from '../config/env';
import { StatusCodes } from 'http-status-codes';
import { JWT_EXPIRATION_STATUS_CODE, JWT_INVALID_STATUS_CODE } from '../constants';
export const auth = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (token === undefined || token === null) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        status: 'There is an Error',
        message: 'Ensure that you are logged in',
      });
    }

    const pin = token.split(' ')[1];

    if (!pin || pin === '') {
      return res.status(StatusCodes.FORBIDDEN).send({
        status: "Error",
        message: `${JWT_INVALID_STATUS_CODE}. This pin can't be used`,
      });
    }
    const decoded = jwt.verify(pin, ENV.APP_SECRET as string);
    req.user = decoded;

    return next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        status: "Error",
        message: `${JWT_EXPIRATION_STATUS_CODE}. Please, login again`,
      });
    }

    console.log("ERROR:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Error",
      message: "An unexpected error occurred.",
    });
  }
};
