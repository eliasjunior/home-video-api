import jwt from "jsonwebtoken";
import crypto from "crypto";

const accessSecret = process.env.JWT_ACCESS_SECRET || "access-secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh-secret";
const accessTtl = process.env.JWT_ACCESS_TTL || "15m";
const refreshTtl = process.env.JWT_REFRESH_TTL || "180d";

function parseDurationToMs(value) {
  if (typeof value === "number") {
    return value;
  }
  const match = String(value).match(/^(\d+)([smhd])$/i);
  if (!match) {
    return 0;
  }
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * multipliers[unit];
}

export function issueTokens({ userId, username }) {
  const accessToken = jwt.sign(
    { sub: userId, username },
    accessSecret,
    { expiresIn: accessTtl }
  );

  const jti = crypto.randomUUID();
  const refreshToken = jwt.sign(
    { sub: userId, jti, type: "refresh" },
    refreshSecret,
    { expiresIn: refreshTtl }
  );

  const refreshExpiresAtMs = Date.now() + parseDurationToMs(refreshTtl);

  return { accessToken, refreshToken, jti, refreshExpiresAtMs };
}

export function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, refreshSecret);
}
