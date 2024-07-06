import { ENV } from "../config";

export const ACCESS_TOKEN = 'sessions.accessToken.hng';
export const REFRESH_TOKEN = 'sessions.hng';
export const JWT_ACCESS_TOKEN_EXPIRATION_TIME = ENV.IS_PROD ? '30m' : '12h';
export const JWT_REFRESH_TOKEN_EXPIRATION_TIME = ENV.IS_PROD ? '15m' : '6h';
export const JWT_EXPIRATION_STATUS_CODE = 'JWT: Expired';
export const JWT_INVALID_STATUS_CODE = 'JWT: Invalid';