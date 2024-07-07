<template>
  <dialog class="modal" :id>
    <div class="modal-box">
      <h3 class="font-bold text-lg">Change password</h3>
      <div v-if="auth">
        <span class="input-disabled">
          <NewUsername v-model="auth.username" :inputClass="{ 'input-disabled': true }"></NewUsername>
        </span>
        <NewPassword v-model="password"></NewPassword>
      </div>
      <div v-else>
        No auth selected
      </div>
      <div class="modal-action">
        <form method="dialog" class="join flex justify-between gap-x-6 w-full">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="reset()">Close</button>
          <!-- change button, disabled when tooWeak -->
          <!-- loading -->
          <button class="btn btn-secondary" disabled v-if="status == 'pending'">Changing password</button>
          <button class="btn btn-error" :disabled="tooWeak" @click.prevent="changePassword()" v-else-if="status == 'idle'">Change
            password</button>
            <!-- success -->
          <button class="btn btn-success" v-else-if="status == 'success'" @click="reset()">Password changed</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import { useZXCVBN } from '~/composables/auth/useZXCVBN';
import NewPassword from '../auth/NewPassword/NewPassword.vue';
import NewUsername from '../auth/NewUsername.vue';
import { sha256Hex } from '@clinic/crypto';
const props = defineProps<{
  id: string,
  auth?: {
    username: string,
    userId: number,
  }
}>()
const userId = computed(() => props.auth?.userId)
const password = ref("");
const result = useZXCVBN(password);
const tooWeak = computed(() => result.value.score < 1)
const { execute: changePassword, status,clear } = useAsyncData(async () => {
  return await $fetch("/api/maintenance/auth/password", {
    method: "PATCH",
    body: {
      userId: userId.value,
      password: await sha256Hex(password.value),
    }
  })
}, {
  immediate: false,
})

function reset() {
  password.value = "";
  clear()
}

</script>
