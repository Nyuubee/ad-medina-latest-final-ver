<template>
    <button class="btn btn-sm w-max">
        <icon name="material-symbols:refresh" class="text text-lg" :class="iconClass" />
    </button></template>
<script setup lang="ts">
defineProps<{
    iconClass?: string
}>()
</script>
