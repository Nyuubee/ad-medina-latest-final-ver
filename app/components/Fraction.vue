<template>
    <div>
        <slot name="numerator" :numerator>
            <span>{{ numerator }}</span>
        </slot>
        /
        <slot name="denominator" :denominator>
            <span>{{ denominator }}</span>
        </slot>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    numerator: number
    denominator: number
}>()
</script>
