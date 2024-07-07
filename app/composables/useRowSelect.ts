export function useRowSelect<T extends { id: V }, V>() {
    const selected = ref<T>()
    function deselect() {
        selected.value = undefined
    }

    function toggle(t: T) {
        if (selected.value?.id === t.id) {
            deselect()
        } else {
            selected.value = t
        }
    }
    return {
        selected,
        deselect,
        toggle
    }
}
