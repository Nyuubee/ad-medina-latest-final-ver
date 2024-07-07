<template>
  <div>
    <FormKit type="form" @submit="(data) => username = data.username" :actions=false
      formClass="flex gap-x-2 text-center items-center">
      <FormKit type="text" name="username" id="username" class="" placeholder="username" />
      <SearchSubmit />
    </FormKit>
    <RecordTable :active @update:active="active = $event" :columns :records="auths" identifier="userId">
      <tr v-show="!auths" class="text-center text-lg">
        <td class="text-lg" colspan="20">No User accounts found</td>
      </tr>
      <template #footer>
        <tfoot class="flex flex-col w-full justify-center" colspan='0'>
          <PageBar class="scale-75" :canNext :canPrev :max="max" :min="page.displayedNumber" @next="next"
            @prev="prev" />
        </tfoot>
      </template>
    </RecordTable>
  </div>
</template>
<script setup lang="ts">
const username = ref<string>()
const { data } = useFetch("/api/maintenance/auth/count",
  {
    ...defaultCount(),
    query: { username },
    watch: [username],
  })
const perPage = useCookie('auth-per-page', {
  default: () => 4,
  sameSite: 'lax',
})
const { page, canNext, canPrev, max, limit, offset } = usePagination(data, perPage.value)
const { next, prev } = usePageControlFromQuery('admin', 'authlist', page)
const { data: auths } = useFetch("/api/maintenance/auth", {
  query: {
    limit,
    offset,
    username,
  },
  watch: [username]
})
const active = defineModel<Flatten<typeof auths>|undefined|null>("active")
const columns = { 'userId': 'User ID', 'username': 'Username' }
</script>
