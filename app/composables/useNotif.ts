import type { FormKitNode } from "~/utils/formkit"

export interface AppNotif {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    icon: string
    message: string
    timeoutMS: number
}
export const notifsQueue = ref<AppNotif[]>([])
export const timeouts = ref<Record<string, (number | NodeJS.Timeout|undefined)>>({})

export function prepDismissNotif(notif: AppNotif) {
    return () => {
        clear(notif)
        return notifsQueue.value = notifsQueue.value.filter(n => n.id != notif.id)
    }
}
export function dismissNotif(notif: AppNotif) {
    clear(notif)
    notifsQueue.value = notifsQueue.value.filter(n => n.id != notif.id)
}

export function clear(notif:AppNotif) {
    clearTimeout(timeouts.value[notif.id])
    timeouts.value[notif.id] = undefined
}
export function delayCloseNotif(notif: AppNotif) {
    clearTimeout(timeouts.value[notif.id])
    const t = setTimeout(prepDismissNotif(notif), notif.timeoutMS)
    timeouts.value[notif.id] = t
}
export function addNotif(notif: AppNotif) {
    // adding the same id will reset the timeout to the new value
    if (timeouts.value[notif.id] !== undefined) {
        delayCloseNotif(notif)
        return
    }
    notifsQueue.value.push(notif)
    delayCloseNotif(notif)
}


export function useNotifWithControl<T>(args: {
    body:Ref<T|undefined>, 
    formkitForm:Ref<FormKitNode<unknown> | undefined>, 
    dialogId:string, 
    notif:Ref<AppNotif>|AppNotif}
) {
    const _notif = toRef(args.notif)
    function add() {
        args.body.value = undefined;
        args.formkitForm.value?.reset();
        (document.getElementById(args.dialogId) as HTMLDialogElement | undefined)?.close();
        addNotif(_notif.value)
    }

    return {
        add,
    }
}
