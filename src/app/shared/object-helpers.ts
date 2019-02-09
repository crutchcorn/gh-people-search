/**
 * Map through all keys in an object and call a CB. Assign that CB's return value to the key in question
 * @param object - The object to make this call on. This would otherwise be bound to `Object.prototype` but I don't like breaking the web
 * @param {objectMap} cb - The callback in order to run the `Object.map` function
 * @returns - The object with it's keys altered by the cb param
 */
export function ObjectMap<T extends object = object, K extends keyof T = keyof T>(object: T, cb: (value: T[K], key: K, object?: T) => any):
  Record<K, any> {
  return Object.keys(object).reduce<T>((prev, key) => {
    prev[key] = cb(object[key], (key as any), object);
    return prev;
  }, ({} as any));
}

export function RemoveSparseObjectKeys<T extends object>(object: T): Partial<T> {
  return Object.keys(object).reduce((prev, key) => {
    if (object[key]) {
      prev[key] = object[key];
    }
    return prev;
  }, {});
}
