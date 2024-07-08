import jwt from "jsonwebtoken";
import { generateToken } from "../../src/controllers/user/authController";
import ENV from "../../src/config/env";

describe("Token Generation", () => {
  it("should generate a token with correct user details", () => {
    const user = { id: "user123", email: "user@example.com" };
    const token = generateToken(user);
    const decoded: any = jwt.verify(token, ENV.APP_SECRET as string);

    expect(decoded.userId).toBe(user.id);
    expect(decoded.email).toBe(user.email);
  });

  it("should expire the token at the correct time", () => {
    const user = { id: "user123", email: "user@example.com" };
    const token = generateToken(user);
    const decoded: any = jwt.verify(token, ENV.APP_SECRET as string);

    // Check token expiration
    const expiry = decoded.exp - decoded.iat;
    expect(expiry).toBe(3600);
  });
});
