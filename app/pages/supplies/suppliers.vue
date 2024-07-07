<template>
  <!-- searchbar -->
  <main>
    <h1>Suppliers</h1>
    <!-- actions: add supplier, edit supplier -->
    <dialog id="new_supplier_dialog" class="modal" @close="refresh()">
      <div class="modal-box">
        <h3 class="font-bold text-lg">New Supplier</h3>
        <ClientOnly>
          <FormSupplier :id="ID.add" @submit="(data) => newSupplierBody = data" />
        </ClientOnly>
        <!-- show: SupplierNew -->
        <div class="modal-action">
          <form method="dialog" class="flex w-full place-content-between">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-error">Close</button>
            <button class="btn btn-primary" @click.prevent="newSupplierForm?.submit()">
              <Icon name="material-symbols:save" class="h-6 w-6" />
              Save
            </button>
          </form>
        </div>
      </div>
    </dialog>

    <!-- edit supplier dialog -->
    <dialog id="edit_supplier_dialog" class="modal" @close="refresh()">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Edit Supplier</h3>
        <ClientOnly>
          <FormSupplier :id="ID.edit" v-model:supplier="selected"
          @submit="(value) => editBody = value" 
          />
        </ClientOnly>
        <!-- show: SupplierEdit -->
        <div class="modal-action">
          <form method="dialog" class="flex w-full place-content-between">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-error">Close</button>
            <button class="btn btn-primary" @click.prevent="editSupplierForm?.submit()">
              <Icon name="material-symbols:save" class="h-6 w-6" />
              Save
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <div class="join print:hidden">
      <!-- New Suppliers -->
      <button class="join-item btn btn-sm" onclick="new_supplier_dialog.showModal()">
        <Icon name="material-symbols:add" class="text text-lg" />
        New Supplier
      </button>
      <!-- edit supplier -->
      <button class="join-item btn btn-sm" :class="{ 'btn-disabled': !selected }"  onclick="edit_supplier_dialog.showModal()">
        <Icon name="material-symbols:edit" class="text text-lg" />
        Edit Supplier
      </button>
    </div>
    <FormKit type="form" @submit="(data) => searchQuery = data" :actions=false
      formClass="mt-2 flex gap-x-2 text-center items-center">
      <!-- mode: id | name -->
      <FormKit type="select" name="searchBy" id="searchBy" class="" :options="{'id': 'ID', 'name': 'Name'}" v-model="searchBy"  />
      <!-- id -->
      <FormKit type="text" name="id" id="id" class="" placeholder="ID" v-if="searchBy == 'id'" />
      <!-- name -->
      <FormKit type="text" name="name" id="name" class="" placeholder="Supplier's name" v-if="searchBy == 'name'" />
      <SearchSubmit />
      <!-- refresh button -->
       <RefreshButton @click="refresh()" />
    </FormKit>
    <RecordTable class="mt-2" :columns :records="suppliers" v-model:active="selected" identifier="id">
    </RecordTable>
  </main>
</template>
<script setup lang="ts">
import RefreshButton from '~/components/RefreshButton.vue';
import FormSupplier from '~/components/supplies/FormSupplier.vue';
import type { tables } from '~/server/database';
import { useFormKitNodeById } from '~/utils/formkit';
const _searchQuery = ref({
  'id': undefined,
  'name': undefined,
})
const searchQuery = useSearchQuery(_searchQuery)
const { data: count } = useFetch('/api/supplies/suppliers/count', {
  watch: [searchQuery],
  query: searchQuery,
})
const { data: suppliers, refresh } = useFetch('/api/supplies/suppliers', {
  watch: [searchQuery],
  query: searchQuery,
})

const searchBy = ref<'id'|'name'>('id')
watch(searchBy, () => {
  searchQuery.value = {
    'id': undefined,
    'name': undefined,
  }
})
const columns = {
  'id': 'ID',
  'name': 'Name',
  'address': 'Address',
}

const selected = ref<typeof tables.suppliers.$inferSelect>()

const newSupplierBody = ref<typeof tables.suppliers.$inferInsert>()
const ID = {
  add: 'new-supplier-form',
  edit: 'edit-supplier-form',
}
const newSupplierForm = useFormKitNodeById(ID.add)
const { data: newSupplier } = useFetch("/api/supplies/suppliers", {
  method: 'POST',
  body: newSupplierBody,
  watch: [newSupplierBody],
  immediate: false,
})

const { add: showSupplierNotif } = useNotifWithControl({
  body: newSupplierBody,
  dialogId: 'new_supplier_dialog',
  formkitForm: newSupplierForm,
  notif: {
    message: 'New supplier added',
    type: 'success',
    icon: 'material-symbols:check-circle',
    timeoutMS: 5000,
    id: 'new-supplier',
  }
})

watch(newSupplier, (newSupplier) => {
  if (newSupplier) {
    showSupplierNotif()
  }
})

// edit supplier
const editSupplierForm = useFormKitNodeById('edit-supplier-form')
const editBody = ref<typeof tables.supplies.$inferInsert>()
const { data: editResponse, status: editStatus, clear: clearEdit } = useAsyncData(async () => {
  console.log(editBody.value)
  if (editBody.value?.id) {
    const response = await $fetch(`/api/supplies/suppliers/${editBody.value.id}`, {
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
  dialogId: 'edit_supplier_dialog',
  formkitForm: editSupplierForm,
  notif: {
    message: 'Supplier updated',
    type: 'success',
    icon: 'material-symbols:check-circle',
    timeoutMS: 5000,
    id: 'edit-supplier',
  }
})

watch(editStatus, (editStatus) => {
  if (editStatus === 'success') {
    showEditNotif()
  }
})

</script>
