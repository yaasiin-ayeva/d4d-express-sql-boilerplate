import { Response } from 'express';
import { IModel } from './model.interface';
export interface IResponse extends Response {
  locals: {
    data?: Record<string, unknown> | Record<string, unknown>[] | IModel | IModel[],
    meta?: {
      total: number,
      pagination?: {
        current?: number,
        next?: number,
        prev?: number
      }
    }
  };
}