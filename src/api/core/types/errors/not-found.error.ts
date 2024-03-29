import * as HTTP_STATUS from 'http-status';
import { IHTTPError, IError } from '../interfaces';
import { TypeplateError } from './typeplate.error';


/**
 * @description Custom NotFoundError
 */
export class NotFoundError extends TypeplateError implements IHTTPError {

  /**
   * @description IError HTTP response status code
   */
  statusCode: number;

  /**
   * @description IError HTTP response status message
   */
  statusText: string;

  /**
   * @description Ierror HTTP response errors
   */
  errors: Array<string>;

  constructor(error: IError) {
    super('A resource was not found');
    this.statusCode = 404;
    this.statusText = 'Resource not found';
    this.errors = [ error.message ];
  }
}