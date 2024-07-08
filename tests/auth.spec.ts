import request from "supertest";
import app from "../src/app";
import { db } from "../src/config";

beforeAll(async () => {
  await db.sync({ force: true });
});

afterAll(async () => {
  await db.close();
});

describe("POST /auth/register", () => {
  it("should register user successfully with default organisation", async () => {
    const response = await request(app).post("/api/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.user.email).toBe("john.doe@example.com");
    expect(response.body.data.organization.name).toBe("John's Organisation");
    expect(response.body.data.token).toBeDefined();
  });

  it("should log the user in successfully", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.status).toBe("success");
    expect(loginResponse.body.data.user.email).toBe("john.doe@example.com");
    expect(loginResponse.body.data.token).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const response = await request(app).post("/api/auth/register").send({
      firstName: "",
      lastName: "Doe",
      email: "",
      password: "",
    });

    expect(response.status).toBe(422);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toContain("Validation error");
  });

  it("should fail if there’s duplicate email", async () => {
    // First registration
    await request(app).post("/api/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
    });

    // Duplicate registration
    const response = await request(app).post("/api/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
    });

    expect(response.status).toBe(422);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toContain("User or phone already exists");
  });
});
