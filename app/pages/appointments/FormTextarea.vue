<template>
  <div>
    <label>{{ label }}</label>
    <textarea :name="name" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :placeholder="placeholder"></textarea>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  label: String,
  name: String,
  placeholder: String,
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);
</script>
