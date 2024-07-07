<template>
  <div>
    <label>{{ label }}</label>
    <input :type="type" :name="name" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  label: String,
  name: String,
  type: String,
  placeholder: String,
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);
</script>
