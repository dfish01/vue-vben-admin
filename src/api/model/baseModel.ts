export interface BasicPageParams {
  current: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  items: T[];
  total: number;
}

export interface Pagination {
  total: number;
  size: number;
  current: number;
  orders: any[];
  optimizeCountSql: boolean;
  searchCount: boolean;
  maxLimit: number | null;
  countId: number | null;
  pages: number;
}

export interface BasePageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
}

export interface IdReq {
  id: number | string;
}

export interface StringReq {
  content: string;
}
