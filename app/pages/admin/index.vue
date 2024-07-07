<template>
  <NuxtLayout name="default">

    <Head>
      <Title>
        ADMIN
      </Title>
    </Head>
    <template #navbar-start>
      <!-- save config -->
      <button class="btn btn-primary" @click="$formkit.submit('config')">
        <Icon name="material-symbols:save" class="w-5 h-5" />
        Save
      </button>
    </template>
    <main class="form-control gap-y-8">
      <h1 class="divider text-2xl">Maintenance</h1>
      <div class="form-control">
        <h2 class="text-xl">User management</h2>
        <AdminConfigForm @saved="addNotif({
          id: 'config-saved',
          type: 'success',
          message: 'Configuration saved!',
          icon: 'material-symbols:check-circle',
          timeoutMS: 5000,
        })" />
      </div>
      <div>
        <h2 class="text-xl">Users list</h2>
        <div class="w-full overflow-y-auto">
          <ClientOnly>
            <UsersList />
            <template #fallback>
              <div class="loading loading-spinner"></div>
            </template>
          </ClientOnly>
        </div>

        <!-- <table class="table table-sm">
          <tr>
            <th v-for="column in columns">{{ column }}</th>
          </tr>
          <tr v-for="user in users">
            <td v-for="column in columns">{{ user[column] }}</td>
          </tr>
        </table> -->
        <div class="w-max">
          <h2 class="text-xl">User Accounts</h2>
          <div class="join">
            <!-- change password -->
            <button class="join-item btn btn-sm btn-primary" onclick="changePassword.showModal()" :class="authActionClass">
              <Icon name="material-symbols:lock" class="w-5 h-5" />
              Change password
            </button>
            <!-- change roles -->
            <button class="join-item btn btn-sm  btn-primary" onclick="editRoles.showModal()" :class="authActionClass">
              <Icon name="material-symbols:group" class="w-5 h-5" />
              View/Edit Roles
            </button>
          </div>
          <ClientOnly>
            <AuthList v-model:active="selectedAuth" />
            <template #fallback>
              <div class="loading loading-spinner"></div>
            </template>
          </ClientOnly>
        </div>
      </div>
      <div>
        <h2 class="text-xl">Ban list</h2>
        <AdminBanList />
      </div>
      <ForgotPassword id="changePassword" :auth="selectedAuth" />
      <EditRoles id='editRoles' :auth="selectedAuth" />
    </main>
    <!-- backup and restore -->
     <BackupAndRestore class="m-auto"></BackupAndRestore>
     <div class="h-8"></div>
      <h2 class="text-xl">Access Logs</h2>
     <ClientOnly>
      <AdminAccessLogs />
      <template #fallback>
        <div class="loading loading-spinner"></div>
        </template>
     </ClientOnly>

  </NuxtLayout>
</template>
<script setup lang="ts">
import AuthList from '~/components/admin/AuthList.vue';
import UsersList from '~/components/admin/UsersList.vue';
import ForgotPassword from '~/components/admin/ForgotPassword.vue';
import EditRoles from '~/components/admin/EditRoles.vue';
import BackupAndRestore from '~/components/admin/BackupAndRestore.vue';
definePageMeta({
  layout: false,
})

const selectedAuth = ref<{ userId: number, username: string }>()
const authActionClass = computed(() => selectedAuth.value == null ? 'btn-disabled' : '')
</script>
