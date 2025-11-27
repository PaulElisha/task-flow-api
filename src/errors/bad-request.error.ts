/** @format */

import { ErrorCode, ErrorCodeType } from "../enums/error-code.enum.ts";
import { AppError } from "./app.error.ts";
import { HttpStatusCodeType } from "../config/http.config.ts";
import { HTTP_STATUS } from "../config/http.config.ts";

export class BadRequestExceptionError extends AppError {
  constructor(
    public message: string,
    public statusCode: HttpStatusCodeType,
    public errorCode?: ErrorCodeType
  ) {
    super(
      message,
      HTTP_STATUS.BAD_REQUEST,
      errorCode || ErrorCode.VALIDATION_ERROR
    );
  }
}
