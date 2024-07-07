<template>
  <div>
    <button type="submit">{{ label }}</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: String,
});

</script>
