export interface IModel {
  id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  whitelist: string[];
}