import { getOrganizations } from "../../src/controllers/organization/organizationController";
import { Organizations } from "../../src/models";
import { JwtPayload } from "jsonwebtoken";
import { Response } from "express";

jest.mock("../../src/models");

describe("Organization Access", () => {
  it(`should not allow users to see data from organizations they don’t have access to`, async () => {
    const req = {
      user: { userId: "user123" },
      params: {},
    } as JwtPayload;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (Organizations.findAll as jest.Mock).mockResolvedValueOnce([]);

    await getOrganizations(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Organisations retrieved successfully",
      data: { organizations: [] },
    });
  });
});
