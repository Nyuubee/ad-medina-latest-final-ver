<template>
<div class="join">
    <button class="join-item btn btn-primary btn-sm">
        <Icon name="material-symbols:add" class="text text-lg" />
    </button>
    <div class="join-item text text-lg">
        &nbsp; {{ amount }} &nbsp;
    </div>
    <button class="join-item btn btn-danger btn-sm ">
        <Icon name="material-symbols:remove" class="text text-lg" />
    </button>
</div>
</template>
<script setup lang="ts">
defineProps<{
    amount: number
    max: number
    min: number
}>()
</script>
