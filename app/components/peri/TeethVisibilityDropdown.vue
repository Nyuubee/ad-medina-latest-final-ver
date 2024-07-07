<template>
<div class="dropdown">
  <div tabindex="0" role="button" class="btn btn-sm m-1">Teeth Visibility</div>
  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    <li class="form-control" v-for="label, visibility in TeethPartVisibilityOptions"
    :key="visibility">
      <label class="label cursor-pointer">
        <span class="label-text">
          {{ label }}
        </span>
        <input 
        type="radio" 
        class="radio radio-primary" 
        name="teeth-visibility"
        :value="value"

        :checked="visibility === value"
        @input="emit('update:modelValue', visibility)"
        />
      </label>
    </li>
  </ul>
</div>
</template>
<script setup lang="ts">
import { type TeethPartVisibility, TeethPartVisibilityOptions } from '~/utils/peri';

defineModel<TeethPartVisibility>('value')

const emit = defineEmits<{
  'update:modelValue': [value: TeethPartVisibility]
}>()
</script>
