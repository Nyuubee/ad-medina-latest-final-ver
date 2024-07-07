<template>
  <Head>
    <Title>Login</Title>
  </Head>
  <form class="card card-normal h-max  w-full max-w-xl self-center" @submit.prevent="goLogin()">
    <div class="card-body">
      <!-- TODO: Use the commented labels for errors/assistance -->
      <label class="label">
        <span class="label-text text-lg">Username:</span>
        <span class="label-text-alt text-error text-lg " v-if="wrongCredentials">Wrong username or password</span>
        <!-- banned -->
        <span class="label-text-alt text-error text-lg" v-if="banned">You are banned!</span>
      </label>
      <input required class="input" :class="{ 'input-error': wrongCredentials }" type="text" name="username" id="username"
        placeholder="username" v-model="username" />
      <label class="label">
        <!-- <span class="label-text-alt">Bottom Left label</span>
                    <span class="label-text-alt">Bottom Right label</span> -->
      </label>
      <label class="label">
        <span class="label-text">Password:</span>
        <span class="label-text-alt text-error" v-if="wrongCredentials">Wrong username or password</span>
      </label>
      <PasswordVisibilityControl>
        <template #default="{passwordType}">
          <input required class="grow" :class="{ 'input-error': wrongCredentials }" :type="passwordType" name="password"
            id="current-password" placeholder="password here" v-model="password" autocomplete="current-password" />
        </template>
      </PasswordVisibilityControl>
      <label class="label">
        <!-- <span class="label-text-alt">Bottom Left label</span> -->
        <!-- <span class="label-text-alt">Bottom Right label</span> -->
      </label>
      <div class="card-actions flex-col self-center items-center">
        <button class="btn btn-info" v-if="isLoginPending">Logging in...</button>
        <button class="btn-primary btn h-full px-5 text-lg" v-else>Login</button>
        <NuxtLink to="/user/forgot-password" class="btn-ghost btn w-max"> Forgot password </NuxtLink>
        <NuxtLink v-if="canRegister" to="/register" class="btn-secondary btn w-max self-center"> Register </NuxtLink>
        <button v-else class="btn btn-disabled w-max self-center">
        Registration Disabled
      </button>
      </div>
    </div>
  </form>
  <div class="divider w-full self-center">OR USE</div>
    <AuthProviders callback-url="" />
</template>
<script setup lang="ts">
import PasswordVisibilityControl from '~/components/auth/PasswordVisibilityControl.vue';
import { login } from '~/utils/auth/login';

definePageMeta({
  layout: 'guest',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
/**
 * @see https://next-auth.js.org/configuration/pages#sign-in-page
 */
const username = ref("");
const password = ref("");
const { data: loginResponse, execute: goLogin, status: loginStatus } = useAsyncData(async() => login(username.value, password.value),
  {
    immediate: false,
    default:() => false,
  },
)
const isLoginPending = computed(() => loginStatus.value == "pending")
const errors = computed(() => loginResponse.value?.error)
const wrongCredentials = computed(() => errors.value == "CredentialsSignin")
// banned user
const banned = computed(() => errors.value == "banned user")
// 
const {data:canRegister} = useFetch("/api/maintenance/registration", {
  default:() => false,
})
</script>
<style scoped>
:deep(.input) {
  @apply lg:py-8 text-xl bg-base-300
}
</style>
