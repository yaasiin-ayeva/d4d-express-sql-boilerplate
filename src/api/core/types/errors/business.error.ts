import * as HTTP_STATUS from 'http-status';
import { IHTTPError, IError } from '../interfaces';
import { TypeplateError } from './typeplate.error';


/**
 * @description Custom BusinessError
 */
export class BusinessError extends TypeplateError implements IHTTPError {

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
    super('Business validation failed');
    this.statusCode = error.statusCode;
    this.statusText = 'Business validation failed';
    this.errors = [ error.message ];
  }
}