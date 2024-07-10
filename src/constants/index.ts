import { ENV } from "../config";

export const ACCESS_TOKEN = 'sessions.accessToken.hng';
export const REFRESH_TOKEN = 'sessions.hng';
export const JWT_ACCESS_TOKEN_EXPIRATION_TIME = ENV.IS_PROD ? '30m' : '1h';
export const JWT_EXPIRATION_STATUS_CODE = 'JWT: Expired';
export const JWT_INVALID_STATUS_CODE = 'JWT: Invalid';
