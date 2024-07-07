<template>
<label class="label py-[0.1em] lg:py[0.3em]">
    <span class="label-text pr-1">
        <b>
            {{ id }} -
        </b>
        <slot></slot>
    </span>
    <input 
        type="checkbox" 
        name="teeth-state" 
        class="checkbox checked:bg-primary" 
        :checked="value"
        @input="emit('update:modelValue', !value)"
    />
</label>
</template>
<script setup lang="ts">
import type { ToothCategory } from '~/utils/peri/Tooth';

// emit a boolean value to the parent component
defineProps<{
    id:ToothCategory,
    value: boolean
}>()
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

</script>   
