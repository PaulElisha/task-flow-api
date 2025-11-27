/** @format */
import { Request, Response, NextFunction } from "express";
import { UnauthorizedExceptionError } from "../errors/unauthorized-exception.error.ts";
import { HTTP_STATUS } from "../config/http.config.ts";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user._id) {
    throw new UnauthorizedExceptionError(
      "Unauthorized. Please log in.",
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  next();
};
