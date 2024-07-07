<template>
  <label class="input input-bordered flex items-center gap-2">
    <slot :passwordType :visible>

    </slot>
    <ShowButton v-model:show-password="visible" />
  </label>
</template>
<script setup lang="ts">
// see https://daisyui.com/components/input/#text-input-with-icon-inside
import { usePasswordVisibility } from '~/composables/usePasswordVisibility';
import ShowButton from './ShowButton.vue';

const { passwordType, visible } = usePasswordVisibility()
</script>
