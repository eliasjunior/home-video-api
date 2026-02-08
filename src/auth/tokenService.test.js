import jwt from "jsonwebtoken";

describe("tokenService", () => {
  let issueTokens;
  let verifyAccessToken;
  let verifyRefreshToken;

  beforeEach(async () => {
    process.env.JWT_ACCESS_SECRET = "access-secret";
    process.env.JWT_REFRESH_SECRET = "refresh-secret";
    process.env.JWT_ACCESS_TTL = "15m";
    process.env.JWT_REFRESH_TTL = "180d";
    jest.resetModules();
    ({ issueTokens, verifyAccessToken, verifyRefreshToken } = await import("./tokenService.js"));
  });

  it("issues access and refresh tokens", () => {
    const { accessToken, refreshToken, jti, refreshExpiresAtMs } = issueTokens({
      userId: "user-1",
      username: "admin",
    });

    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    expect(jti).toBeTruthy();
    expect(refreshExpiresAtMs).toBeGreaterThan(Date.now());
  });

  it("verifies access token", () => {
    const accessToken = jwt.sign({ sub: "user-1", username: "admin" }, "access-secret", {
      expiresIn: "15m",
    });

    const payload = verifyAccessToken(accessToken);

    expect(payload.sub).toBe("user-1");
  });

  it("verifies refresh token", () => {
    const refreshToken = jwt.sign({ sub: "user-1", jti: "abc", type: "refresh" }, "refresh-secret", {
      expiresIn: "180d",
    });

    const payload = verifyRefreshToken(refreshToken);

    expect(payload.jti).toBe("abc");
  });
});
