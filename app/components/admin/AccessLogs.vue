<template>
    <div>
        <FormKit type="form" @submit="(data) => searchQuery = data" :actions=false
            formClass="flex gap-2 flex-wrap lg:flex-nowrap text-center items-center">
            <!-- log id -->
            <FormKit type="number" name="id" id="id" min="0" placeholder="Log ID" />
            <!-- user id -->
            <FormKit type="number" name="userId" id="userId" min="0" placeholder="User ID" />
            Date:
            <div class="tooltip tooltip-bottom" data-tip="Start date (inclusive)">
                <FormKit type="date" name="start" placeholder="Start Date" />
            </div>
            <!-- end date -->
            <span>-</span>
            <div class="tooltip tooltip-bottom" data-tip="End date (inclusive)">
                <FormKit type="date" name="end" placeholder="End Date" />
            </div>
            <SearchSubmit />
            <RefreshButton @click="refresh()" />
        </FormKit>
        <RecordTable :records="logs" identifier="id"
            :columns="{ 'id': 'Log ID', 'userId': 'User ID', 'createdAt': 'Time', 'method': 'HTTP Method', 'path': 'Location' }"
            @click="">
            <!-- load logs -->
            <div v-if="countStatus == 'idle' || logsStatus == 'idle'">
                <button class="btn" @click="load()">Load logs</button>
            </div>
            <tr v-show="!logs" class="text-center text-lg">
                <td class="text-lg" colspan="20">No logs found</td>
            </tr>
            <template #footer>
                <tfoot class="flex flex-col w-full justify-center" colspan='0'>
                    <PageBar class="scale-75" :canNext :canPrev :max="max" :min="page.displayedNumber" @next="next"
                        @prev="prev" />
                </tfoot>
            </template>
        </RecordTable>
    </div>
</template>
<script setup lang="ts">
import RefreshButton from '../RefreshButton.vue';

interface SearchQuery {
    id?: number | string // formkit makes this a string when cleared
    userId?: number | string
    start?: string
    end?: string
}
const _search_query = ref<SearchQuery>({
    id: undefined,
    userId: undefined,
    start: undefined,
    end: undefined,
})
const searchQuery = useSearchQuery(_search_query)

const { data: recordsCount, status: countStatus, execute: loadCount } = useFetch("/api/maintenance/accesslogs/count", {
    ...defaultCount(),
    query: searchQuery,
    watch: [searchQuery],
    immediate: false,
})
const LIMIT = 7
const { page, max, canNext, canPrev } = usePagination(recordsCount, LIMIT)
const { data: logs, refresh, status: logsStatus, execute: loadLogs } = useAsyncData(async () => {
    const data = await $fetch("/api/maintenance/accesslogs", {
        query: {
            limit: page.perPage,
            offset: page.offset,
            ...searchQuery.value,
        },
    })
    return data;
}, {
    watch: [() => page.current, searchQuery],
    immediate: false,
})
const { next, prev } = usePageControlFromQuery('admin', 'accessLogs', page)

async function load() {
    await loadCount()
    await loadLogs()
}
</script>
