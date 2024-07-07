<template>
    <NuxtLink :to="{
        path: `/dental-chart/${$route.params.id ?? ''}`,
    }" active-class="active">
        <Icon name="material-symbols:person" />
        Dental Chart
    </NuxtLink>
</template>
<script setup lang="ts">
const route = useRoute("dental-chart-id")
</script>
