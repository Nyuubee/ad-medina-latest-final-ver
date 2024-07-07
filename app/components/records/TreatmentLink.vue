<template>
    <NuxtLink :to="{
        path: `/dental-chart/${$route.params.id}/treatment-record`,
    }" active-class="active">
        <Icon name="material-symbols:list-alt" />
        Treatment Record
    </NuxtLink>
</template>
<script setup lang="ts">
const route = useRoute("dental-chart-id")
</script>
