import express from "express";
import { AUTH_USER, validateCredentials } from "../auth/user";
import {
  issueTokens,
  verifyRefreshToken,
} from "../auth/tokenService";

export function createAuthRouter({ refreshTokenStore }) {
  const router = express.Router();

  router.post("/login", (req, res) => {
    const { username, password } = req.body || {};
    if (!validateCredentials({ username, password })) {
      return res.status(401).json({ message: "Invalid credentials" }).end();
    }

    const { accessToken, refreshToken, jti, refreshExpiresAtMs } = issueTokens({
      userId: AUTH_USER.id,
      username: AUTH_USER.username,
    });

    refreshTokenStore.save({
      jti,
      userId: AUTH_USER.id,
      expiresAtMs: refreshExpiresAtMs,
    });

    return res.status(200).json({ accessToken, refreshToken }).end();
  });

  router.post("/refresh", (req, res) => {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return res.status(400).json({ message: "Missing refresh token" }).end();
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      if (payload.type !== "refresh") {
        return res.status(401).json({ message: "Invalid refresh token" }).end();
      }

      const record = refreshTokenStore.get(payload.jti);
      if (!record || record.userId !== payload.sub) {
        return res.status(401).json({ message: "Refresh token revoked" }).end();
      }
      if (record.expiresAtMs < Date.now()) {
        refreshTokenStore.delete(payload.jti);
        return res.status(401).json({ message: "Refresh token expired" }).end();
      }

      refreshTokenStore.delete(payload.jti);
      const { accessToken, refreshToken: newRefreshToken, jti, refreshExpiresAtMs } =
        issueTokens({
          userId: payload.sub,
          username: AUTH_USER.username,
        });
      refreshTokenStore.save({
        jti,
        userId: payload.sub,
        expiresAtMs: refreshExpiresAtMs,
      });

      return res.status(200).json({ accessToken, refreshToken: newRefreshToken }).end();
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" }).end();
    }
  });

  router.post("/logout", (req, res) => {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return res.status(400).json({ message: "Missing refresh token" }).end();
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      refreshTokenStore.delete(payload.jti);
    } catch {
      // swallow invalid token on logout
    }

    return res.status(200).json({ message: "Logged out" }).end();
  });

  return router;
}
