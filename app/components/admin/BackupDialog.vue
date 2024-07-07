<template>
    <!-- dialog of a input file tag -->
    <!-- accept .sql -->
    <dialog class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Backup</h3>
            <p class="py-4">Press ESC key or click the button below to close</p>
            <div class="modal-action items-center">
                <form method="dialog" class="join flex justify-center gap-x-6 w-full">
                    <input type="file" ref="inputFile" accept=".sql" class="hidden" id="backup-file" />
                    <button class="btn btn-primary" @click="backup()">
                        <Icon name="material-symbols:backup"></Icon>
                        Backup
                    </button>
                    <button class="btn btn-error">
                        <Icon name="material-symbols:close"></Icon>
                        Close
                    </button>
                </form>
            </div>
        </div>
    </dialog>
</template>
<script setup lang="ts">
const inputFile = ref<HTMLInputElement>()

const { data, execute: backup } = useAsyncData(async () => {
    const response = await $fetch("/api/maintenance/backup", {
        responseType: "stream",
        onResponseError(response) {
            console.error(response)
        },
        async onResponse(response) {
            const reader = response.response.body?.getReader()
            // download the file
            const chunks: Uint8Array[] = []
            reader?.read().then(function processText({ done, value }) {
                if (done) {
                    const blob = new Blob(chunks)
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    // backup_<date>_<time>.json
                    const dayjs = useDayjs()
                    a.download = `backup_${dayjs().format("YYYY-MM-DD_HH-mm-ss")}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                    return
                }
                chunks.push(value)
                reader?.read().then(processText)
            })
        }
    })
    // return nothing
}, {
    immediate: false
})
</script>
