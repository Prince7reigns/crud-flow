import { ApiError } from "../utils/ApiError.js";

export const requireTrustedOrigin = (req, _res, next) => {
  if (process.env.NODE_ENV === "production") {
    const clientOrigin = process.env.CLIENT_URL;
    const requestOrigin = req.get("Origin");

    if (!clientOrigin || requestOrigin !== clientOrigin) {
      return next(ApiError.forbidden("Request origin not allowed"));
    }
  }

  next();
};
