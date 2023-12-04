import { ObjectId } from 'mongoose';

export function sortAlphabetically(values: string[], ascOrder: boolean = true) {
  const sortFunction = ascOrder
    ? (a: string, b: string) => a.localeCompare(b)
    : (a: string, b: string) => b.localeCompare(a);

  return values.sort(sortFunction);
}

export function convertObjectIdToString(
  item: ObjectId | ObjectId[] | string[] | string,
) {
  return Array.isArray(item)
    ? item.map((value) => value.toString())
    : item.toString();
}
