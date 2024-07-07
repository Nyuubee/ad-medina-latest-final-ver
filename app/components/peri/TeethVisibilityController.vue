<template>
<div class="visible-part-ctrl flex w-max">
    <div class="form-control p-1">
        <label>
          <span class="label-text">All</span> 
          <input type="radio" name="hidden-part" class="hide-none" :value
        @input="emit('update:modelValue', 'all')"
          />
        </label>
      </div>
    <div class="form-control p-1">
      <label>
        <span class="label-text">Only Temporary Teeth</span> 
        <input type="radio" name="hidden-part" class="hide-temporary" :value
        @input="emit('update:modelValue', 'temporary')"
        />
      </label>
    </div>
    <div class="form-control p-1">
      <label>
        <span class="label-text">Only Permanent Teeth</span> 
        <input type="radio" name="hidden-part" class="hide-permanent" :value
        @input="emit('update:modelValue', 'permanent')"
        />
      </label>
    </div>
</div>
</template>
<script setup lang="ts">
import type { TeethPartVisibility } from '~/utils/peri';

defineModel<TeethPartVisibility>('value')

const emit = defineEmits<{
  'update:modelValue': [value: TeethPartVisibility]
}>()
</script>
<style scoped>
.visible-part-ctrl {
  /* Some default values */
  --hide-none-color: red;
  --hide-temporary-color: green;
  --hide-permanent-color: blue;
}
input {
  @apply radio;
}
input:checked {
  background: var(--checked-color);
}

.hide-none {
  --checked-color: var(--hide-none-color);
}
.hide-temporary {
  --checked-color: var(--hide-temporary-color);
}
.hide-permanent {
  --checked-color: var(--hide-permanent-color);
}
label {
  @apply label cursor-pointer flex gap-x-2;
}
</style>
../../utils
