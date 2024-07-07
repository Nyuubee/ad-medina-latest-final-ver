<template>
  <NuxtLayout name="default">

    <Head>
      <Title>
        List | Supplies
      </Title>
    </Head>
    <template #navbar-start>
      <!-- add button -->
      <div class="join print:hidden">
        <button class="join-item btn btn-primary btn-sm" onclick="new_supply_dialog.showModal()">
          <Icon name="material-symbols:add" class="text text-lg" />
          New Supply
        </button>
        <!-- Use supply -->
        <button class="join-item btn btn-sm" :class="{ 'btn-disabled': !selected || selected.quantityLeft == 0}"
          onclick="use_supply_dialog.showModal()">
          <Icon name="material-symbols:shopping-cart" class="text text-lg" />
          Use Supply
        </button>
        <!-- edit supply -->
        <button class="join-item btn btn-sm" onclick="edit_supply_dialog.showModal()"
          :class="{ 'btn-disabled': !selected }">
          <Icon name="material-symbols:edit" class="text text-lg" />
          Edit Supply
        </button>
      </div>
    </template>
    <template #navbar-end>
      <PrintButton />
    </template>
    <!-- new dialog -->
    <dialog id="new_supply_dialog" class="modal" @close="refreshSupplies()">
      <div class="modal-box">
        <h3 class="font-bold text-lg">New Supply</h3>
        <ClientOnly>
          <SuppliesForm :id="ID.add" @submit="(value) => newBody = value">
            <!-- loading -->
            <span v-if="newStatus == 'pending'">
              Submitting
              <span class="loading loading-dots">
              </span>
            </span>
          </SuppliesForm>
        </ClientOnly>
        <!-- show: SuppliesNew -->
        <div class="modal-action">
          <form method="dialog" class="flex w-full place-content-between">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-error">Close</button>
            <!-- success -->
            <button class="btn btn-primary" @click.prevent="newSupplyForm?.submit()">
              <Icon name="material-symbols:save" class="h-6 w-6" />
              Save
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <!-- edit dialog -->
    <dialog id="edit_supply_dialog" class="modal" @close="refreshSupplies()">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Edit Supply</h3>
        <ClientOnly>
          <SuppliesForm :id="ID.edit" :supply="selected" v-if="selected" @submit="(value) => editBody = value">
            <!-- loading -->
            <span v-if="editStatus == 'pending'">
              Submitting
              <span class="loading loading-dots">
              </span>
            </span>
          </SuppliesForm>
        </ClientOnly>
        <!-- show: SuppliesEdit -->
        <div class="modal-action">
          <form method="dialog" class="flex w-full place-content-between">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-error">Close</button>
            <button class="btn btn-primary" @click.prevent="editSupplyForm?.submit()">
              <Icon name="material-symbols:save" class="h-6 w-6" />
              Save
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <!-- use supply dialog -->
    <UseSupply id="use_supply_dialog" :formId="ID.use" :supply="selected" @close="refreshSupplies()" />
    <!-- show: SuppliesUse -->
    <main class="flex flex-col w-full">
      <!-- Searchbar -->
      <ClientOnly>
        <PrintHeader />
        <FormKit :id="ID.search" type="form"
          formClass="flex flex-col md:flex-row gap-2 text-center items-start md:items-center w-max md:w-full print:hidden"
          @submit="(data) => searchQuery = data" :actions="false">
          <!-- Dropdown: search by: ID, name, category, supplier  -->
           <FormKit type="select" id="searchBy" name="searchBy" placeholder="Search by"
            :options="{
              id: 'ID',
              name: 'Item name',
              category: 'Category',
              supplier: 'Supplier',
              isCritical: 'Only Critical level'
            }" v-model="selectedBy" />
          <FormKit type="number" name="id" id="id" min="0" placeholder="ID" v-if="selectedBy == 'id'" />
          <FormKit type="text" id="name" name="name" placeholder="Item name"  v-if="selectedBy == 'name'" />
          <!-- category -->
          <FormKit type="select" id="category" name="category" placeholder="Category"  v-if="selectedBy == 'category'"
             :options="{
              restorative: 'Restorative',
              prosthodontics: 'Prosthodontics',
              surgery: 'Surgery',
              orthodontic: 'Orthodontic',
              generalMaterials: 'General Materials'
            }" />
          <!-- Supplier:dropdown -->
          <FormKit type="select" id="supplier" name="supplier" placeholder="Supplier"  v-if="selectedBy == 'supplier'" :options />

          <!-- critical level:checkbox -->
          <!-- <FormKit type="checkbox" id="isCritical" name="isCritical" label="Critical level" /> -->
          <FormKit type="hidden" id="isCritical" name="isCritical" label="Critical level" :value="'true'" v-if="selectedBy == 'isCritical'" />
          <SearchSubmit>
            <!-- clear button -->
            <FormKit type="button" id="reset" inputClass="btn btn-sm join-item" @click="searchQuery = {}; searchForm?.reset()">
              Clear
            </FormKit>
          </SearchSubmit>
          <!-- refresh button -->
          <FormKit type="button" inputClass="btn btn-sm" @click="refreshSupplies()">
            <Icon name="material-symbols:refresh" class="text text-lg" />
          </FormKit>
        </FormKit>
      </ClientOnly>
      <RecordTable :records="supplies" identifier="id" :columns="columns" v-model:active="selected">
        <!-- if null -->
        <tr v-if="!supplies" class="text-center text-lg">
          <td class="text-lg" colspan="20">No supplies found</td>
        </tr>
        <template #supplier="{ value }">
          <div class="text-xs">
            {{ value }}
          </div>
        </template>
        <template #category="{ value }">
          {{ value }}
        </template>
        <!-- remaining -->
        <template #quantityLeft="{ value, index }" v-if="supplies">
          <div>
            {{ value }}
            <!-- if critical level, show danger icon -->
            <Icon v-if="supplies[index].isCriticalLevel" name="material-symbols:warning" class="text-error h-4 w-4" />
          </div>
        </template>
      </RecordTable>
      <div class="flex w-full justify-center">
        <PageBar :canNext :canPrev :max="max" :min="page.displayedNumber" @next="next" @prev="prev" class="scale-75" />
      </div>
      <ClientOnly>
        <PrintFooter reportPrefix="su" />
      </ClientOnly>
    </main>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useFormKitNodeById } from '@formkit/vue';
import RecordTable from '~/components/RecordTable.vue';
import SuppliesForm from '~/components/supplies/Form.vue'
import UseSupply from '~/components/supplies/UseSupply.vue';
import type { tables } from '~/server/database';
definePageMeta({
  layout: false,
})
const ID = {
  add: 'new-supply-form',
  edit: 'edit-supply-form',
  use: 'use-supply-form',
  search: 'supplies-search',
}
const selectedBy = ref<"id"|"name"|"category"|"supplier"|"isCritical" >("id")
const searchForm = useFormKitNodeById(ID.search)
watch(selectedBy, () => {
  searchQuery.value = {}
  if (selectedBy.value === 'isCritical') {
    searchQuery.value.isCritical = true
  }
  // Note: no need to reset the form, since when the component is not rendered due to v-if, its state is excluded
})
// Interacting with the record table
const selected = ref<typeof tables.supplies.$inferSelect>()
const columns = {
  id: 'ID',
  name: 'Item',
  unit: 'Unit',
  category: 'Category',
  quantityLeft: 'Quantity Left',
  criticalLevel: 'Critical Level',
  supplier: 'Supplier',
  createdAt: 'Date Added',
}

// Search query
const _searchQuery = ref<Partial<{
  id: number
  name: string
  category: string
  supplier: string
  isCritical: boolean
}>>({
  id: undefined,
  name: undefined,
  category: undefined,
  supplier: undefined,
  isCritical: undefined,
})

const searchQuery = useSearchQuery(_searchQuery)

// pagination variables
const { data: suppliesCount } = useFetch("/api/supplies/count", {
  ...defaultCount(),
  query: searchQuery,
  watch: [searchQuery],
})
const { page, canNext, canPrev, max, limit, offset } = usePagination(suppliesCount, 15)

const { next, prev } = usePageControlFromQuery('supplies', 'suppliesPage', page)

const withLimitOffset = computed(() => {
  return {
    limit: limit.value,
    offset: offset.value,
    ...searchQuery.value,
  }
})
// Fetching supplies
const { data: supplies, refresh: refreshSupplies } = useFetch("/api/supplies", {
  query: withLimitOffset,
  transform(data) {
    return data?.map(record => {
      return {
        ...record,
        createdAt: new Date(record.createdAt).toLocaleDateString(),
      }
    })
  },
  watch: [searchQuery, () => page.current],
})

// New supply related
const newSupplyForm = useFormKitNodeById(ID.add)
const newBody = ref<typeof tables.supplies.$inferInsert>()
const { status: newStatus } = useFetch("/api/supplies", {
  method: 'POST',
  body: newBody,
  watch: [newBody],
  immediate: false,
})

const { add: showSupplyNotif } = useNotifWithControl({
  body: newBody,
  formkitForm: newSupplyForm,
  dialogId: 'new_supply_dialog',
  notif: {
    message: 'New supply added',
    type: 'success',
    icon: 'material-symbols:check-circle',
    timeoutMS: 5000,
    id: 'new-supply',
  }
})
watch(newStatus, (newStatus) => {
  if (newStatus === 'success') {
    showSupplyNotif()
  }
})

// Editing related
const editSupplyForm = useFormKitNodeById(ID.edit)
const editBody = ref<typeof tables.supplies.$inferInsert>()
const { data: editResponse, status: editStatus, clear: clearEdit } = useAsyncData(async () => {
  console.log(editBody.value)
  if (editBody.value?.id) {
    const response = await $fetch(`/api/supplies/${editBody.value.id}`, {
      method: 'PATCH',
      body: editBody.value,
    })
    return response
  }
}, {
  watch: [editBody],
  immediate: false,
})

const { add: showEditNotif } = useNotifWithControl({
  body: editBody,
  formkitForm: editSupplyForm,
  dialogId: 'edit_supply_dialog',
  notif: {
    message: 'Supply updated',
    type: 'success',
    icon: 'material-symbols:check-circle',
    timeoutMS: 5000,
    id: 'edit-supply',
  }
})
watch(editStatus, (editStatus) => {
  if (editStatus === 'success') {
    showEditNotif()
  }
})


const { data: suppliers } = useFetch("/api/supplies/suppliers")
const options = computed(() => {
  return suppliers.value?.map(s => s.name) ?? []
})
</script>
