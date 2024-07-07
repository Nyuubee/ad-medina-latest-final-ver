<template>
  <NuxtLayout name="default">
    <template #navbar-start>
      <!-- Edit -->
      <div class="flex gap-x-4">
        <button class="btn" @click="viewing = !viewing">
          <Icon name="material-symbols:edit" v-if="viewing"></Icon>
          <Icon name="material-symbols:visibility" v-else></Icon>
          {{ viewing ? 'Edit' : 'View' }}
        </button>
        <!-- Save -->
        <button class="btn btn-primary" @click="form?.submit()" v-if="!viewing">
          <Icon name="material-symbols:save"></Icon>
          Save
        </button>
      </div>
    </template>
    <template #navbar-end>
      <button class="btn secondary" onclick="logout_modal.showModal()">
        <Icon name="material-symbols:logout"></Icon>
        Log out
      </button>
    </template>
    <!-- Open the modal using ID.showModal() method -->
    <LogoutDialog id="logout_modal" />
    <main class="p-2 flex flex-col items-center">
      <FormKit v-if="user" name="user" :id="FORM_ID" type="form" formClass="grid grid-cols-3 w-max" :value="user"
        :actions="false" :disabled="viewing" @submit="(data) => body = data">
        <!-- <div class="card">
          <div class="card-body">
            <div class="card-title">
              Profile picture:
            </div>
            <div class="avatar">
              <div class="w-32 rounded-full">
                <img :src="data?.user?.image!" alt="">
              </div>
            </div>
          </div>
        </div> -->

        <!-- add role card -->
        <div class="card col-span-3">
          <div class="card-body">
            <div class="card-title">
              Roles:
            </div>
            <div v-for="{ role } of user.roles" class="badge badge-outline">
              {{ role }}
            </div>
          </div>
        </div>

        <FormKit validation="" name="firstName" id="firstName" label="First Name" type="text" />
        <FormKit validation="" name="middleName" id="middleName" label="Middle Name" type="text" />
        <FormKit validation="" name="lastName" id="lastName" label="Last Name" type="text" />
        <FormKit validation="" name="email" id="email" type="email" label="Email" />
        <FormKit name="phone" id="phone" label="Contact #" type="tel" :placeholder="CONTACT_NUMBER.mobile.placeholder"
          :help="CONTACT_NUMBER.mobile.placeholder" :validation="CONTACT_NUMBER.mobile.matches" :validation-messages="{
            matches: `Incorrect format`
          }" />
        <FormKit validation="" name="address" id="address" label="Address" type="textarea" />
        <FormKit validation="" name="birthDate" id="birthDate" label="Birthdate" type="date" />
        <FormKit validation="" name="sex" id="sex" label="Sex" type="select" :options="['male', 'female']"></FormKit>

        <div>
          <!-- Starts the next div in the next row -->
        </div>
        <div>
          <h2 class="text-lg">
            Google Account:
          </h2>
          <span class="ml-4" v-if="data?.user?.oauth == 'google'">
            <Icon name="material-symbols:check" class="btn btn-sm btn-success btn-circle"></Icon>
            Linked
          </span>
          <div v-else class="flex justify-start">
            <AuthProviders :callbackUrl />
          </div>
        </div>
      </FormKit>
      <br>
      <div class="self-start">
      </div>
    </main>
  </NuxtLayout>
</template>
<script setup lang="ts">
import LogoutDialog from "~/components/auth/LogoutDialog.vue";
import { FormKit, useFormKitNodeById, type FormKitGroupValue, type SubmitHandler } from "~/utils/formkit"
import { CONTACT_NUMBER } from "~/utils/records";

const { data, getSession } = useAuth();
// Override layout to add the dental chart progression
definePageMeta({
  layout: false
})
const viewing = ref(true)
const callbackUrl = computed(() => {
  return `/user?bind=true&id=${data.value?.user?.id}`;
});

onMounted(async () => {
  if (route.query.bind) {
    const response = await $fetch(`/api/oauth/bind/${route.query.id}`, {
      method: 'POST',
    })
    const session = await getSession({
      callbackUrl: '/user',
    })
  }
})
const FORM_ID = "user"
const route = useRoute("user")
const { data: user } = useFetch(`/api/users/${data.value?.user?.id}`)
const body = ref()
const form = useFormKitNodeById(FORM_ID)
const { data: editData, error: editError, status: editStatus } = useAsyncData(async () => {
  const response = await $fetch(`/api/users/${data.value?.user?.id}`, {
    method: 'PATCH',
    body: body.value,
  })
  return response
}, {
  watch: [body],
  immediate: false,
})
watch(editStatus, (status) => {
  if (status == 'success') {
    viewing.value = true
    addNotif({
      id: 'user-information-updated',
      message: 'Information updated',
      type: 'success',
      icon: 'material-symbols:check-circle',
      timeoutMS: 5000,
    })
  } else if (status == 'error') {
    viewing.value = false
    form.value?.setErrors({
      email: 'Email is taken'
    })
    addNotif({
      id: 'user-information-updated',
      message: 'Email is taken',
      type: 'error',
      icon: 'material-symbols:error',
      timeoutMS: 5000,
    })
  }
})
</script>
