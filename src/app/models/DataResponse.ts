export interface DataResponse<T> {
  count: number;
  currentPage: number;
  items: T;
  pageSize: number;
  totalPages: number;
}
