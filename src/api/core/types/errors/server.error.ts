import * as HTTP_STATUS from 'http-status';
import { IHTTPError, IError } from '../interfaces';
import { TypeplateError } from './typeplate.error';


/**
 * @description Type native error
 */
export class ServerError extends TypeplateError implements IHTTPError {

  /**
   * @description HTTP response status code
   */
  statusCode: number;

  /**
   * @description HTTP response status message
   */
  statusText: string;

  /**
   * @description HTTP response errors
   */
  errors: Array<string>;

  constructor(error: IError) {
    super(error.message)
    this.statusCode = 500;
    this.statusText = 'Ooops... server seems to be broken';
    this.errors = [ 'Looks like someone\'s was not there while the meeting\'' ];
  }

}