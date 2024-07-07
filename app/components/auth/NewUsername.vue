<template>
  <span>
  <label class="label">
    <span class="label-text text-xl">Username:</span>
    <span class="label-text-alt">
      <slot name="top-right-label"></slot>
    </span>
  </label>
  <input class="input input-error w-full" type="text" name="username" id="username" placeholder="username" required
    v-model="username" @input="onInput" :class="{ ...{ 'input-error': isInvalid }, ...inputClass }" />
  <label class="label">
    <!-- <span class="label-text-alt text-lg text-info">
      </span> -->
    <span class="label-text-alt">
      <slot name="bottom-right-label"></slot>
    </span>
  </label>
  </span>
</template>
<script setup lang="ts">
import useInvalid from '~/composables/auth/useInvalid';
defineProps<{ inputClass?: Record<string, boolean> }>()
const username = defineModel<string>();
const { isInvalid, onInput } = useInvalid();
</script>
