export type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

/**
 * Sums a property of an array of objects
 * ```ts
 * const items = [{a: 1}, {a: 2}, {a: 3}]
 * const total = sum(items, 'a') // 6
 * ```
 */
export function sum<T extends Record<K, number>, K extends keyof T>(ts:T[], key: K) {
    return ts.reduce((acc, it) => acc + it[key], 0)
}
