<template>

  <Head>
    <Title>Sign Up</Title>
  </Head>
  <form class="card card-normal h-max w-full max-w-xl self-center" @submit.prevent="goRegister()">
    <div class="card-body" v-if="canRegisterStatus == 'pending'">
      <!-- loading -->
      <div class="text-center text-info text-2xl">
        Loading...
      </div>
    </div>
    <template v-if="canRegisterStatus == 'success'">
      <div class="card-body" v-if="canRegister">
        <!-- TODO: Use the commented labels for errors/assistance -->
        <AuthNewUsername v-model="username" :inputClass="{ 'input-error': duplicateUsername }">
          <template #top-right-label>
            <span class="text-error text-xl" v-if="duplicateUsername">
              <span>Username is taken</span>
            </span>
            <span class="text-info text-xl">
              <!-- loading -->
              <span v-if="registerStatus == 'pending'">Signing in...</span>
            </span>
          </template>
        </AuthNewUsername>
        <!-- <AuthNewEmail v-model="email" /> -->
        <AuthNewPassword v-model="password" />
        <div class="card-actions flex flex-col items-center self-center gap-y-4">
          <button class="btn-primary btn h-full p-3 text-xl"
            :class="{ 'btn-disabled': tooWeak || duplicateUsername }">Sign
            Up</button>
          <div class="self-center">OR</div>
          <NuxtLink to="/login" class="btn btn-secondary text-xl"> Login instead </NuxtLink>
        </div>
        {{ error }}
      </div>
      <div class="card-body" v-else>
        <div class="text-center text-error">
          Registration is disabled
        </div>
      </div>
    </template>

  </form>
</template>
<script setup lang="ts">
import { register } from '~/utils/auth/register';
import { useZXCVBN } from '~/composables/auth/useZXCVBN';

definePageMeta({
  layout: 'guest',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
const username = ref("");
const password = ref("");
const result = useZXCVBN(password);
const tooWeak = computed(() => result.value.score < 1)
const duplicateUsernames = ref<Set<string>>(new Set())
const duplicateUsername = computed(() => duplicateUsernames.value.has(username.value))
const { data, error, execute: goRegister, status: registerStatus } = useAsyncData(async () => register(username.value, password.value), {
  immediate: false
})
const { data: canRegister, status: canRegisterStatus } = useFetch("/api/maintenance/registration")

watch(data, () => {
  if (data.value == 'UsernameTaken') {
    duplicateUsernames.value.add(username.value)
  }
})
</script>
<style scoped>
:deep(.input) {
  @apply lg:py-8 text-xl bg-base-300
}
</style>
