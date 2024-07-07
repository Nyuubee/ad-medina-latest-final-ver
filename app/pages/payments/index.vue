<template>
    <NuxtLayout name='default'>
        <!-- navbar end -->
        <template #navbar-end>
            <!-- print button -->
            <PrintButton />
        </template>
        <main class="flex flex-col w-full justify-center items-center">
            <PrintHeader />
            <ClientOnly>
                <StatisticsSection />
                <template #fallback>
                    Calculating revenue
                    <div class="loading loading-spinner"></div>
                </template>
            </ClientOnly>
            <div class="text-2xl self-start">
                Recent Transactions:
            </div>
            <!-- table form -->
            <div class="flex flex-col w-full mb-4">
                <SearchInput @search="searchQuery = $event; refresh()">
                    <RefreshButton @click="refresh()" />
                </SearchInput>
                <div class="hidden print:block">
                    <!-- show a label -->
                    <div>
                        Showing only:
                    </div>
                    <!-- show information about search query -->
                    <div v-if="searchQuery.id">ID: {{ searchQuery.id }}</div>
                    <div v-if="searchQuery.method">Payment method: {{ searchQuery.method }}</div>
                    <div v-if="searchQuery.start">Transactions created from: {{ searchQuery.start }}</div>
                    <div>Transactions created until:
                        <template v-if="searchQuery.end">
                            {{ searchQuery.end }}
                        </template>
                        <template v-else>
                            {{ today }}
                        </template>
                    </div>
                </div>
                <PaymentTable v-if="payments?.length" :payments class="h-full grow" :limit="page.perPage" />
                <div v-else class="card w-96 bg-base-200 shadow-xl m-auto">
                    <div class="card-body">
                        <h2 class="card-title
                        ">No payments found</h2>
                        <p>There are no payments to display</p>
                    </div>
                </div>
            </div>
            <div>
                &nbsp;
            </div>
            <div class="flex w-full justify-center">
                <PageBar :canNext="canNext" :canPrev="canPrev" :max="max" :min="page.displayedNumber" @next="next"
                    @prev="prev" />
            </div>
            <DevOnly>
                <details class="print:hidden">
                    <summary>Variables</summary>
                    <pre>
                {{ searchQuery }}
                {{ payments }}
            </pre>
                </details>
            </DevOnly>
        </main>
        <ClientOnly>
            <PrintFooter reportPrefix="pa" />
        </ClientOnly>
    </NuxtLayout>
</template>
<script setup lang="ts">
import SearchInput from '~/components/payment/SearchInput.vue';
import { usePagination } from '~/composables/usePagination';
import StatisticsSection from '~/components/payment/StatisticsSection.vue';
import { useToday } from '~/utils/payment';
import PrintFooter from '~/components/PrintFooter.vue';
import RefreshButton from '~/components/RefreshButton.vue';
definePageMeta({
    layout: false
})
interface SearchQuery {
    id?: number | string // formkit makes this a string when cleared
    method?: string
    start?: string
    end?: string
}
const _search_query = ref<SearchQuery>({
    id: undefined,
    method: undefined,
    start: undefined,
    end: undefined,
})
const searchQuery = useSearchQuery(_search_query)
const { data: recordsCount } = useFetch("/api/payments/count", {
    ...defaultCount(),
    query: searchQuery,
    watch: [searchQuery],
})
const LIMIT = 7
const { page, max, canNext, canPrev } = usePagination(recordsCount, LIMIT)

const { data: payments, refresh } = useAsyncData(async () => {
    return await $fetch("/api/payments", {
        query: {
            limit: page.perPage,
            offset: page.offset,
            ...searchQuery.value,
        },
    })
}, {
    watch: [() => page.current],
})

const { next, prev } = usePageControlFromQuery('payments', 'page', page)
const { today } = useToday()

</script>
