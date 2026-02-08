import request from "supertest";
import express from "express";
import { createAuthRouter } from "./AuthRouter";
import { createInMemoryRefreshTokenStore } from "../auth/refreshTokenStore";
import { AUTH_USER } from "../auth/user";

describe("AuthRouter", () => {
  let app;
  let store;

  beforeEach(() => {
    store = createInMemoryRefreshTokenStore();
    app = express();
    app.use(express.json());
    app.use("/auth", createAuthRouter({ refreshTokenStore: store }));
  });

  it("login returns tokens with valid credentials", async () => {
    const response = await request(app).post("/auth/login").send({
      username: AUTH_USER.username,
      password: AUTH_USER.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeTruthy();
    expect(response.body.refreshToken).toBeTruthy();
  });

  it("login returns 401 with invalid credentials", async () => {
    const response = await request(app).post("/auth/login").send({
      username: "bad",
      password: "bad",
    });

    expect(response.status).toBe(401);
  });

  it("refresh returns new tokens for valid refresh token", async () => {
    const login = await request(app).post("/auth/login").send({
      username: AUTH_USER.username,
      password: AUTH_USER.password,
    });

    const response = await request(app).post("/auth/refresh").send({
      refreshToken: login.body.refreshToken,
    });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeTruthy();
    expect(response.body.refreshToken).toBeTruthy();
  });

  it("refresh returns 401 when token is revoked", async () => {
    const login = await request(app).post("/auth/login").send({
      username: AUTH_USER.username,
      password: AUTH_USER.password,
    });

    const response1 = await request(app).post("/auth/refresh").send({
      refreshToken: login.body.refreshToken,
    });

    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: login.body.refreshToken,
    });

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(401);
  });

  it("logout revokes refresh token", async () => {
    const login = await request(app).post("/auth/login").send({
      username: AUTH_USER.username,
      password: AUTH_USER.password,
    });

    const logout = await request(app).post("/auth/logout").send({
      refreshToken: login.body.refreshToken,
    });

    const refresh = await request(app).post("/auth/refresh").send({
      refreshToken: login.body.refreshToken,
    });

    expect(logout.status).toBe(200);
    expect(refresh.status).toBe(401);
  });
});
