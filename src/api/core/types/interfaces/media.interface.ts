import { DeepPartial } from 'typeorm';
import { User } from '../../models/hr/user.model';
import { MimeType } from '../types';

export interface IMedia {
  path: string;
  filename: string;
  size: number;
  destination: string;
  encoding?: string;
  mimetype: MimeType;
  originalname?: string;
  fieldname?: string;
  owner?: number | User | DeepPartial<User>;
}