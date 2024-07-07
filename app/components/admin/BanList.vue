<template>
    <!-- menu style w/ clear button -->
    <ul class="menu w-56 overflow-y-auto">
        <template v-if="banlist?.length == 0">
            <li>
                <a>
                    <span>No one is banned</span>
                </a>
            </li>
        </template>
        <li v-for="item in banlist">
            <a>
                <!-- <span>{{ item.userId }}</span> -->
                <span>
                    {{ item.user?.auth?.username }}
                </span>
                <!-- x icon -->
                <button class="btn btn-sm btn-ghost" @click="unban(item.userId)">
                    <Icon name="material-symbols:delete" />
                </button>
            </a>
        </li>
    </ul>
    <FormKit type="form" @submit="(data) => ban = data" formClass="form-control gap-y-4" :actions=false>
        <!-- ban by username -->
        <FormKit type="text" label="Username" name="username" id="username" inputClass="!input-md"
            placeholder="Enter username to ban" autocomplete="off" />

        <!-- ban user button -->
        <FormKit type="submit" inputClass="btn btn-error" autocomplete="off" label="Ban user">
            <template #prefix>
                <Icon name="material-symbols:block" class="w-5 h-5" />
            </template>
        </FormKit>
    </FormKit>
    <!-- {{ banlist }} -->
</template>
<script setup lang="ts">
const { data: banlist, refresh: refreshBanList } = useFetch("/api/maintenance/banlist")

const ban = ref<{
    username?: string
}>()
const { data: banResponse } = useFetch("/api/maintenance/banlist", {
    method: "POST",
    query: ban,
    watch: [ban],
    immediate: false
})
watch(banResponse, async () => {
    if (banResponse.value) {
        await refreshBanList()
    }
})

async function unban(userId: number) {
    
    await $fetch(`/api/maintenance/banlist`, {
        method: "DELETE",
        query: {
            userId
        }
    })
    await refreshBanList()
}
</script>
