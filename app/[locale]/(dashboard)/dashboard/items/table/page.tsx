import React from "react";
import { ItemsPage } from "@/components/features";
import { DataTableSkeleton } from "@/components/shared/data-table";
import { searchParamsItemsCache } from "@/lib/nuqs/validations";
import type { DatatableParams } from "@/types/params";
import type { SearchParams } from "@/types/table";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = searchParamsItemsCache.parse(searchParams);

  const paginationParams: DatatableParams & { status?: string[] } = {
    page: params.page,
    pageSize: params.perPage,
    orderBy: params.sort[0]?.id,
    orderDir: params.sort[0]?.desc ? "desc" : "asc",
    search: params.search,
    status: params.status || undefined,
  };

  return (
    <React.Suspense
      fallback={
        <DataTableSkeleton
          columnCount={7}
          rowCount={10}
          showCheckbox={true}
          showSearch={true}
          showFilters={true}
          showPagination={true}
        />
      }
    >
      <ItemsPage params={paginationParams} />
    </React.Suspense>
  );
}
