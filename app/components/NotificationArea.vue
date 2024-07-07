<template>
  <div class="toast toast-center">
    <div class="alert" v-for="notif of notifs" :class="alertClass(notif.type)" :key="notif.id">
      <div class="flex-1">
        <span>
          <Icon :name="notif.icon" class="text-4xl"></Icon>
          {{ notif.message }}
        </span>
      </div>
      <div>
        <button @click="dismissNotif(notif)" class="btn btn-circle btn-sm btn-error">
          <Icon name="material-symbols:close" class="text-2xl"></Icon>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { AppNotif } from '~/composables/useNotif';

const notifs = defineModel<AppNotif[]>({ required: true })

function alertClass(type: AppNotif['type']) {
  return {
    'alert-success': type === 'success',
    'alert-error': type === 'error',
    'alert-warning': type === 'warning',
    'alert-info': type === 'info',
  }
}
</script>
