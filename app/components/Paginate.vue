<template>
    <PageBar @next="next" @prev="prev" :max :min="page.displayedNumber" :canNext :canPrev />
</template>
<script setup lang="ts">
import type { RoutesNamesList } from '@typed-router/__routes';
const props = defineProps<{
    currentLocation:RoutesNamesList
    count:RoutesNamesList
}>()

const { data } = useFetch<void,any,any,'get',{count:number}>(props.count, defaultCount())
const { page, canNext, canPrev, max } = usePagination(data)
const { next, prev } = usePageControlFromQuery(props.currentLocation, 'page', page)
</script>
