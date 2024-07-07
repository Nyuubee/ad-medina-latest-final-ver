export function noEmptyStrings(obj: Record<string, any>) {
    // convert '' to undefined
    return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = value == '' ? undefined : value
        return acc
    }, {} as Record<string, any>)
}

export function useSearchQuery<Query extends Record<string, any>>(q:globalThis.Ref<Query>) {
    const searchQuery = computed({
        get(): Query {
            return q.value
        },
        set(value: Query) {
            q.value = noEmptyStrings(value) as any
        },
    })
    return searchQuery
}
