import request from "supertest";
import { AUTH_USER } from "../auth/user";

export async function getAuthHeader(app) {
  const response = await request(app).post("/auth/login").send({
    username: AUTH_USER.username,
    password: AUTH_USER.password,
  });

  return `Bearer ${response.body.accessToken}`;
}
