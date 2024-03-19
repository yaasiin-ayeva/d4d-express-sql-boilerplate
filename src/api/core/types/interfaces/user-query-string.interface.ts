import { Status } from "../types";
import { IQueryString } from "./query-string.interface";

export interface IUserQueryString extends IQueryString {
  status?: Status;
  username?: string;
  email?: string;
  role?: string;
  website?: string;
}