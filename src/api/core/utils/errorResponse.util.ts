import EnvConfig from "../../config/environment.config";
import { ENVIRONMENT } from "../types/enums";

export default class ErrorResponse extends Error {

  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    if (EnvConfig.env === ENVIRONMENT.test) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}