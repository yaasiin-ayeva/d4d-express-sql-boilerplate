import { MediaType } from "express";
import { IQueryString } from "./query-string.interface";

export interface IMediaQueryString extends IQueryString {
  path?: string;
  fieldname?: string;
  filename?: string;
  size?: number;
  mimetype?: string;
  owner?: string;
  type?: MediaType;
}