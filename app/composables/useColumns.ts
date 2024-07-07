
export function useColumns<T>(t: globalThis.Ref<T[] |null>) {
    const columns = computed<(keyof T)[]>(() => t.value?.length ?? 0 > 0 ? Object.keys(t.value![0]) as any : [] as any)

    return {
        columns,
    }
}
