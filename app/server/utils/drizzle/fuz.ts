/**
 * Shorthand for `%${value}%` to be used in `like` queries
 */
export function fuz(value: string) {
    return `%${value}%`;
}
