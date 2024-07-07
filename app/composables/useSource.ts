import type { AsyncData } from "#app"

export type Source = 'local'| 'remote'
export function useSource<T,Err>(local:Ref<T>, remote:AsyncData<T,Err>) {
    const source = computed(() => {
        return remote.status.value == 'idle' ? 'local' : 'remote'
    })
    
    return {
        source
    }
}
