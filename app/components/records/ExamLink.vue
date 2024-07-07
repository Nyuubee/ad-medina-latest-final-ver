<template>
    <NuxtLink :to="{
        path: `/dental-chart/${$route.params.id}/intraoral-exam/${intraoralExamID ?? ''}`,
    }" active-class="active">
        <Icon name="material-symbols:dentistry-outline" />
        Intraoral Exam
    </NuxtLink>
</template>
<script setup lang="ts">
defineProps<{
    // TODO: Require number
    intraoralExamID?: string|number
}>()

</script>
