<template>
    <div class="join">
        <button class="join-item btn print:hidden" :class="{ 'btn-disabled': !canPrev }" @click="$emit('prev')">
            <Icon name="material-symbols:arrow-left" class="h-12 w-12" />
        </button>
        <Fraction class="btn join-item print:hidden" :numerator="min" :denominator="max" />
        <button class="join-item btn print:hidden" :class="{ ' btn-disabled ': !canNext }" @click="$emit('next')">
            <Icon name="material-symbols:arrow-right" class="h-12 w-12" />
        </button>
        <div class="hidden print:block">
            Page {{ min }} of {{ max }}
        </div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    canNext: boolean
    canPrev: boolean
    max: number
    min: number
}>()

defineEmits<{
    next: [],
    prev: []
}>()
</script>
