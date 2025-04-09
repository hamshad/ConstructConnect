export interface TableSql<T> {
  title: string;
  table_name: string;
  getLength(): Promise<number>;
  getAll(limit?: number): Promise<any[]>;
  getAllIds(): Promise<string[]>;
  insert(data: T): Promise<void>;
}

