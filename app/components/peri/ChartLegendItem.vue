<template>
    <div>
        <b>{{$props.legendId }}</b> - <slot></slot>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    legendId:string,
}>()
</script>
