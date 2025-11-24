export type DatatableParams = {
  page: number;
  pageSize: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
  search?: string;
} & Record<string, unknown>;
