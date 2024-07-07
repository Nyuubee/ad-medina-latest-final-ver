<template>
    <dialog class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Are you sure you want to restore?</h3>
            <p class="py-4">Press ESC key or click the button below to close</p>
            <!-- file -->
            <div class="modal-body">
                <!-- preview filename -->
                <button class="btn btn-primary" @click="open()">
                    <!-- select file -->
                    <Icon name="material-symbols:settings-backup-restore-rounded"></Icon>
                    Select File
                </button>
                <div>File Chosen:</div>
                {{ files?.length ? files[0].name : "No file chosen" }}
                <div>
                    <details class="overflow-auto h-40">
                        <summary>Logs</summary>
                        <pre id="restore-logs"></pre>
                    </details>
                </div>
                <div class="modal-action items-center">
                    <form method="dialog" class="join flex justify-center gap-x-6 w-full">
                        <!-- if there is a button in form, it will close the modal -->
                         <button class="btn btn-success" v-if="status == 'success'" @click="clear()">
                            <Icon name="material-symbols:check-circle-outline" class="h-6 w-6"></Icon>
                            Restored
                         </button>
                         <!-- loading -->
                            <button class="btn btn-primary" v-else-if="status == 'pending'">
                                <Icon name="material-symbols:hourglass-top" class="h-6 w-6"></Icon>
                                Restoring
                            </button>
                        <button v-else class="btn btn-error" @click.prevent="restore()" :class="{'button-disabled':
                            !files?.length}">
                            <Icon name="material-symbols:settings-backup-restore-rounded" class="h-6 w-6"></Icon>
                            Restore 
                        </button>
                        <button class="btn btn-success" @click="reset(); clear()">Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    </dialog>
</template>
<script setup lang="ts">
const { files, open, reset, onChange } = useFileDialog({
    // accept sql files
    accept: ".json",
})
const logs = ref<string[]>([])
const headers = useRequestHeaders(['cookie']) as HeadersInit

const { data, execute: restore,status, clear } = useAsyncData(async() => {
    // submit the file
    if (files.value?.length === 0) {
        return
    }
    const formData = new FormData()
    formData.append("file", files.value![0] as Blob)
    const response = $fetch("/api/maintenance/restore", {
        headers,
        responseType: "stream",
        method: "POST",
        body: formData,
        onResponseError(response) {
            console.error(response)
        },
        async onResponse(response) {
            const reader = response.response.body?.getReader()
            const decoder = new TextDecoder()
            // add the chunks to logs as string
            // get id of the logs
            const restoreLogs = document.getElementById("restore-logs")
            // clear logs
            if (restoreLogs) {
                restoreLogs.innerHTML = ""
                reader?.read().then(function processText({ done, value }) {
                    if (done) {
                        return
                    }
                    const txt = decoder.decode(value) + "\n"
                    restoreLogs.innerHTML += txt
                    console.log(txt)
                    // scroll to bottom of element
                    restoreLogs.scrollTop = restoreLogs.scrollHeight
                    reader?.read().then(processText)
                })
            }
        }
    })
    return response
}, {
    immediate: false,
})
watch(status, (status) => {
    if (status === "success") {
        reset()
    }
})
</script>
