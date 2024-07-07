<!-- defines a sidebar + main content layout -->
<!-- Uses ff DaisyUI components: -->
<!-- drawer, navbar -->
<!-- There are named slots that can be used by overriding the layout in the corresponding page -->
<template>
  <div class="flex min-h-screen">

    <Head>
      <Html :data-theme="theme"></Html>
    </Head>
    <AuthLogoutDialog id="navbar_logout_modal" />
    <div class="drawer xl:drawer-open">
      <input id="sidebar" type="checkbox" class="drawer-toggle " />
      <div class="drawer-content flex flex-col">
        <!-- Page content here -->
        <!-- App bar -->
        <div class="navbar bg-base-100 sticky top-0 z-10 print:hidden">
          <div class="navbar-start">
            <!-- burger menu -->
            <label for="sidebar" class="btn btn-ghost rounded-btn xl:hidden">
              <Icon name="material-symbols:menu" class="text-2xl w-5 h-5" />
            </label>
            <slot name="navbar-start">

            </slot>
          </div>
          <div class="navbar-center">
            <slot name="navbar-center">

            </slot>
          </div>
          <div class="navbar-end">
            <slot name="navbar-end"></slot>
          </div>
        </div>
        <!-- Main content -->
        <div class="p-2 w-full h-full flex flex-col print:visible">
          <slot></slot>
          <ClientOnly>
            <NotificationArea v-model:model-value="notifsQueue" />
          </ClientOnly>
        </div>
      </div>
      <div class="drawer-side z-10 print:hidden">
        <label for="sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu p-2 w-64 min-h-full bg-base-200">
          <!-- Sidebar content here -->
          <li>
            <NuxtLink to="/user" active-class="active">
              <div class="avatar">
                <div class="w-8 rounded-full">
                  <img :src="data?.user?.image" v-if="data?.user?.image" />
                  <Icon name="material-symbols:account-circle" v-else class="w-8 h-8" />
                </div>
              </div>
              {{ data?.user?.name }}
            </NuxtLink>
          </li>
          <!-- admin route-->
          <li v-if="roles.admin">
            <NuxtLink to="/admin" active-class="active">
              <Icon name="material-symbols:settings" class="w-5 h-5" />
              Maintenance
            </NuxtLink>
          </li>
          <li v-if="roles.admin || roles.doctor || roles.receptionist">
            <NuxtLink to="/appointments" active-class="active">
              <Icon name="material-symbols:alarm-on-outline" class="w-5 h-5" />
              Appointments
            </NuxtLink>
          </li>
          <li v-if="roles.admin || roles.doctor">
            <details open>
              <summary>
                <Icon name="material-symbols:edit-document" /> Dental Record
              </summary>
              <ul>
                <li>
                  <!-- add patient -->
                  <NuxtLink to="/dental-chart" active-class="active">
                    <Icon name="material-symbols:add" class="w-5 h-5" />
                    New Patient
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/dental-chart/overview" active-class="active">
                    <!-- think of an icon for overview -->
                    <Icon name="material-symbols:table" class="w-5 h-5" />
                    Overview
                  </NuxtLink>
                </li>
                <slot name="dental-record"></slot>
              </ul>
            </details>
          </li>
          <li v-if="roles.admin || roles.doctor || roles.receptionist">
            <NuxtLink to="/payments" active-class="active">
              <Icon name="material-symbols:payments-outline-rounded" class=" w-5 h-5" />
              Payment
            </NuxtLink>
          </li>
          <li v-if="roles.admin || roles.doctor || roles.inventory_manager">
            <!-- details: Supplies -->
            <!-- inside it: list, suppliers -->
            <details open>
              <summary>
                <Icon name="material-symbols:inventory-2" /> Inventory
              </summary>
              <ul>
                <li>
                  <NuxtLink to="/supplies" active-class="active">
                    <Icon name="material-symbols:inventory" class="w-5 h-5" />
                    Supplies
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/supplies/suppliers" active-class="active">
                    <Icon name="material-symbols:local-shipping" class="w-5 h-5" />
                    Suppliers
                  </NuxtLink>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <NuxtLink to="/help" active-class="active">
              <Icon name="material-symbols:question-mark-rounded" class=" w-5 h-5" />
              Help
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about" active-class="active">
              <Icon name="material-symbols:info-outline-rounded" class="w-5 h-5" />
              About
            </NuxtLink>
          </li>
          <li class="flex">
            <!-- this hidden checkbox controls the state -->
            <!-- https://daisyui.com/components/theme-controller/#theme-controller-using-a-swap -->
            <label class="swap swap-rotate w-full justify-start">
              <input type="checkbox" class="theme-controller" @click="toggleTheme()" />
              <Icon class="swap-on w-5 h-5" name="mi:sun" />
              <Icon class="swap-off w-5 h-5" name="mi:moon" />
              {{ theme }}
            </label>
          </li>
          <li class="justify-end mt-auto">
            <!-- Logout -->
            <button class="justify-start btn btn-ghost" onclick="navbar_logout_modal.showModal()">
              <Icon name="material-symbols:logout" class="w-5 h-5" />
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { notifsQueue } from '~/composables/useNotif';
import NotificationArea from '~/components/NotificationArea.vue';
const { data } = useAuth();
const { theme, toggleTheme } = useThemeCookie()
const roles = computed(() => listToBoolRecord(data.value?.user?.roles ?? [], true))

</script>
<style>
:root {
  font-family: Roboto, sans-serif;
}
</style>
