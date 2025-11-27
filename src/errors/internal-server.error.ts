/** @format */

import { AppError } from "./app.error.ts";
import { ErrorCodeType } from "../enums/error-code.enum.ts";
import { HttpStatusCodeType } from "../config/http.config.ts";
import { HTTP_STATUS } from "../config/http.config.ts";
import { ErrorCode } from "../enums/error-code.enum.ts";

export class InternalServerError extends AppError {
  constructor(
    public message: string,
    public statusCode: HttpStatusCodeType,
    public errorCode?: ErrorCodeType
  ) {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
