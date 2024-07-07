<template>
    <button type="button" :class="[provider.id, 'btn flex h-max gap-x-4 p-4 text-base lg:w-max']">
      <span>
        <img :src="style.logo" class="h-8 md:h-10" alt="" />
      </span>
    </button>
  </template>
  <script setup lang="ts">
import type { AppProvider } from 'next-auth/providers/index';
const {} = useAuth()
  const { provider} = defineProps<{
    /**@see getProviders */
    provider: Omit<AppProvider, "options">,
  }>();
  const prefix = "https://authjs.dev/img/providers/";
  
  /* Some providers have the same logo for light/dark themes */
  const sameLogos: Partial<Record<"google", boolean>> = {
    google: true,
  };
  const style = computed(() => {
    let logo = `${prefix}${provider.id}`;
    if (sameLogos[provider.id as "google"]) {
    } else {
      logo += `-dark`;
    }
    logo += ".svg";
    return { logo };
  });
  </script>
  <style scoped>
  
    /* In the future, add the provider styles here */
  /* .google {
    --bgDark: #fff
    --bg: #fff
    --text: #000
    --textDark: #000
  }*/

  </style>
