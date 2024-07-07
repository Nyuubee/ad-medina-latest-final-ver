<template>
  <div class="min-h-screen px-2 flex flex-col h-full">
    <Head>
        <Html :data-theme="theme"></Html>
    </Head>
    <div class="navbar text-2xl bg-base-100 sticky top-0 z-10 print:hidden">
      <div class="navbar-start">
        <!-- burger menu -->
        <NuxtLink to="/login" class="btn btn-ghost underline">
          <span v-if="data?.user">
            Home
          </span>
          <span v-else>
            Login
          </span>
        </NuxtLink>
        <!-- aout -->
        <NuxtLink to="/about" class="btn btn-ghost underline">About</NuxtLink>
        <slot name="navbar-start">

        </slot>
      </div>
      <div class="navbar-center">
        <div class="avatar mr-4">
          <div class="w-20 rounded-full">
            <img src="/public/favicon-96.png"></img>
          </div>
        </div>
        <h2 class="hidden md:block">
          <NuxtLink to="/about">
            AD Medina Dental Clinic
          </NuxtLink>
        </h2>
        <slot name="navbar-center">

        </slot>
      </div>
      <div class="navbar-end">
        <label class="swap swap-rotate">
          <input type="checkbox" class="theme-controller" @click="toggleTheme()" />
          <Icon class="swap-on w-8 h-8" name="mi:sun" />
          <Icon class="swap-off w-8 h-8" name="mi:moon" />
        </label>
        <slot name="navbar-end"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
const { theme, toggleTheme } = useThemeCookie()
const {data} = useAuth()
</script>
