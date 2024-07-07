<template>
  <FormKit type="form" id="config" name="config" :value="config" v-if="config" @submit="(data) => newConfig = data"
    :actions="false" formClass="w-full">
    <!-- user registration switch -->
    <FormKit type="checkbox" label="Enable user registration" name="USER_REGISTRATION_ENABLED"
      id="USER_REGISTRATION_ENABLED" autocomplete="off"></FormKit>
    <!-- Reset Token Validity duration-->
    <FormKit type="number" label="Reset Token Validity (in seconds):" id="RESET_VERIFICATION_TOKEN_VALIDITY_IN_SECONDS"
      name="RESET_VERIFICATION_TOKEN_VALIDITY_IN_SECONDS" placeholder="Enter duration" min="15" validation="min:30"
      autocomplete="off"></FormKit>
      <!-- LOGGING_ENABLED -->
    <FormKit type="checkbox" label="Enable Logging" name="LOGGING_ENABLED" id="LOGGING_ENABLED" autocomplete="off">
    </FormKit>
  </FormKit>
  <div v-else>
    <!-- card that shows a create button -->
    <div class="card card-normal bg-base-200">
      <div class="card-body">
        <div>
          No configuration found, create one?
        </div>
        <div class="card-actions">
          <button class="btn btn-primary" @click="createConfig(); refreshConfig()">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { data: config, refresh: refreshConfig } = useFetch("/api/maintenance")
const emit = defineEmits<{
  saved: [],
}>()
// if 404: No config found, show a create button
const { execute: createConfig } = useFetch("/api/maintenance/setup", {
  method: 'POST',
  immediate: false,
})
const newConfig = ref<typeof config.value>(null)
const { data: configPatchResult, clear } = useFetch("/api/maintenance", {
  method: 'PATCH',
  immediate: false,
  body: newConfig,
  watch: [newConfig]
})
watch(configPatchResult, async () => {
  if (configPatchResult.value) {
    await refreshConfig()
    clear()
    emit('saved')
  }
})
</script>
