<template>
  <div>
    <label>{{ label }}</label>
    <input type="date" :name="name" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: String,
  name: String,
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);
</script>
