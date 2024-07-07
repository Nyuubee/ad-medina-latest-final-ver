import { useRefHistory } from "#imports";
export function useKeybinds<Raw, Serialized = Raw>(...[source, options]: Parameters<typeof useRefHistory<Raw, Serialized>>) {
    const { undo, redo, ...rest } = useRefHistory(source, options)
    const { Ctrl_Z, Ctrl_Y } = useMagicKeys();
    whenever(Ctrl_Z, () => {
        undo();
    })

    whenever(Ctrl_Y, () => {
        redo();
    })

    return {
        undo,
        redo,
        ...rest
    }
}
