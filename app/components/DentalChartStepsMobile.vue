<template>
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn m-1">Dental Chart Progress</div>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box">
      <!-- create an li for each chart step -->
      <li v-for="p,key in progressRecord" class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">
            {{ p.label }}
          </span>
          <input 
          type="checkbox" 
          class="checkbox" 
          :checked="p.status"
          disabled="true">
        </label>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
// Daisy components used:
// dropdown, checkbox, form-control, menu
defineProps<{
  progressRecord: ProgressRecord
}>()
</script>

