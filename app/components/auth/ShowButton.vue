<template>
     <button type="button" class="btn btn-circle btn-ghost" @click="showPassword = !showPassword"
      aria-label="Show password as plain text. Warning: this will display your password on the screen.">
        <Icon name="material-symbols:visibility-off" class="text text-lg" v-if="showPassword"></Icon>
        <Icon name="material-symbols:visibility" class="text text-lg" v-else></Icon>
      </button>
</template>
<script setup lang="ts">
const showPassword =defineModel<boolean>("showPassword", {required: true})
</script>
