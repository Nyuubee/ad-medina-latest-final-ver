import type { RoutesNamesList } from "@typed-router/__routes"
import { mouth } from "~/utils/peri"
import type { Tooth } from "~/utils/peri/Tooth"

export function selectToothFromUrl(
    toothEditorDialog: Ref<HTMLDialogElement | undefined>,
    selectedTooth: Ref<Tooth | undefined>,
    route: {
        query: {
            toothId?: number
        }
    },
) {
    if (route.query.toothId) {
        selectedTooth.value = mouth.value.byId[route.query.toothId]
        toothEditorDialog.value?.showModal()
    }
}
export function useToothFromUrl<T extends RoutesNamesList>(name:T) {
    const selectedTooth = ref<Tooth>()
    const toothEditor = ref<HTMLDialogElement>()
    const route = useRoute(name)

    function _selectToothFromUrl() {
        selectToothFromUrl(
            toothEditor,
            selectedTooth,
            route,
        )
    }
    watch(() => route.query.toothId, _selectToothFromUrl)

    onMounted(_selectToothFromUrl)
    function closeModal() {
        selectedTooth.value = undefined
        toothEditor.value?.close()
        navigateTo({
            query: {
                toothId: undefined,
            }
        })
    }

    return {
        selectedTooth,
        toothEditor,
        closeModal,
        selectToothFromUrl: _selectToothFromUrl,
    }
}
