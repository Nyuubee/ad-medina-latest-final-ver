<template>
    <div class="flex justify-center items-center space-x-4">
      <button @click="$emit('prev')" :disabled="!canPrev" class="pagination-button" :class="{ disabled: !canPrev }">
        <Icon name="material-symbols:arrow-back-ios" class="icon-size" />
      </button>
      <span class="page-text">{{ min }} / {{ max ? max:1 }}</span>
      <button @click="$emit('next')" :disabled="!canNext" class="pagination-button " :class="{ disabled: !canNext }">
        <Icon name="material-symbols:arrow-forward-ios" class="icon-size " />
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    canNext: Boolean,
    canPrev: Boolean,
    max: Number,
    min: Number
  });
  </script>
  
  <style scoped>
  .items-center {
    align-items: center;
  }
  .pagination-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem; /* Increase padding to double the size */
    font-size: 2rem; /* Double the font size */
    font-weight: 500;
    background-color: #e5e7eb;
    color: #6b7280;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    @apply print:hidden ml-4;
  }
  .pagination-button.disabled {
    background-color: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
  }
  .icon-size {
    width: 2rem; /* Double the icon size */
    height: 2rem; /* Double the icon size */
  }
  .page-text {
    font-size: 2rem; /* Double the text size */
  }
  </style>
  