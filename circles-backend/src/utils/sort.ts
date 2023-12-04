import { TObject } from '@src/types/common';
import { filterTruthy } from './filter';

export function groupObjectByKey(items: TObject<any>[] = [], key = 'id') {
  return filterTruthy(items).reduce((obj, item) => {
    const value = item[key];

    if (!(value in obj)) obj[value] = [];

    obj[value].push(item);

    return obj;
  }, {});
}

export function sortByKey(items: TObject<any>[] = [], key = 'id') {
  return items.sort((a, b) => a[key] - b[key]);
}
