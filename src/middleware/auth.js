import { verifyAccessToken } from "../auth/tokenService";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing access token" }).end();
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, username: payload.username };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid access token" }).end();
  }
}
