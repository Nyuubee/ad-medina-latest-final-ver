<template>
  <div class="card card-compact">
    <div class="card-body flex-row justify-center gap-x-8">
      <AuthProviderButton v-for="(p, key) in providers" :provider="p" :key="key" @click="signIn(p.id, {
        callbackUrl,
      })" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { AppProvider } from 'next-auth/providers/index';
const { getProviders, signIn,data } = useAuth();

defineProps<{
  callbackUrl: string;
}>()

async function filter() {
  //Keep only the oAuth ones
  const { credentials, email, ...ps } = await getProviders();
  const oAuth: Record<string, Omit<AppProvider, "options">> = {};
  for (const [key, p] of Object.entries(ps)) {
    if (p) {
      oAuth[key] = p;
    }
  }
  return oAuth;
}
const providers = await filter();
</script>
