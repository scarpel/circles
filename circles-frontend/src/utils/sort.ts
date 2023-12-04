import { TObject } from "@customTypes/common";
import { filterTruthy } from "./filter";

export function groupObjectByKey<T>(items: T[] = [], key = "id") {
  return filterTruthy(items).reduce((obj, item) => {
    const value = item[key];

    if (!(value in obj)) obj[value] = [];

    obj[value].push(item);

    return obj;
  }, {}) as TObject<T[]>;
}

export function sortByKey(items: TObject<any>[] = [], key = "id") {
  return items.sort((a, b) => a[key] - b[key]);
}
