import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import type { Item } from "../api/items";
import { parseAsStringArray } from "./array-parsers";
import { getSortingStateParser } from "./parsers";

const searchParamsBase = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(""),
};

export const searchParamsItemsCache = createSearchParamsCache({
  ...searchParamsBase,
  sort: getSortingStateParser<Item[]>().withDefault([
    { id: "updatedAt", desc: true },
  ]),
  status: parseAsStringArray,
});
